//  jock-highlight.js — syntax highlighting for Jock.
//
//  A port of the compiler's own lexer, not an approximation of it.
//  The token layer follows `crates/jockc/hoon/lib/lex.hoon` rule for
//  rule; the adjacency layer that sits on top of it follows `+p-post`
//  in `lib/parse.hoon`.  That split is the compiler's own: the lexer
//  records `glued` (%.y iff no whitespace separates a token from its
//  predecessor) and nothing else, and the parser is the only thing
//  that interprets it.  Keeping the split here means the two rules
//  the language calls out for loud failure — the adjacency law
//  (language.md §2.4) and spaced binary `-` (§4.2) — are rendered as
//  errors rather than silently painted as ordinary syntax.
//
//  Normative sources, in the order they bind:
//    - docs/spec/language.md          the frozen tables (§2.2–§4.2)
//    - crates/jockc/hoon/sur/jock.hoon  $keyword, $jpunc, $jatom
//    - crates/jockc/hoon/lib/lex.hoon   the state machine
//
//  `tools/hilite.py` holds this file to all three: it diffs the
//  keyword and punctuator inventories against /sur/jock, and runs
//  every examples/*.jock through the tokenizer asserting an exact
//  round-trip and no error tokens.
//
//  No dependencies, no build step.  Browser: include the file and
//  every `<pre class="jock">` is highlighted on DOMContentLoaded.
//  Node: `require()` it for {tokenize, render, flatten}.

'use strict';
(function (global) {

  //  ---------------------------------------------------------------
  //  Inventories.  Each mirrors a table that is normative elsewhere;
  //  tools/hilite.py fails if any of them drifts.
  //  ---------------------------------------------------------------

  //  $keyword (/sur/jock).  Grouped only for scope naming; the
  //  lexer treats the union as flat, exactly as the mold does.
  var KEYWORDS_DECL = ['let', 'var', 'func', 'lambda', 'struct', 'class',
                       'impl', 'trait', 'union', 'alias', 'import'];
  var KEYWORDS_CTRL = ['if', 'else', 'crash', 'assert', 'loop', 'defer',
                       'recur', 'match', 'switch', 'eval', 'print'];
  var KEYWORDS_OP   = ['as', 'in', 'and', 'or', 'xor', 'not'];
  var KEYWORDS = KEYWORDS_DECL.concat(KEYWORDS_CTRL, KEYWORDS_OP);

  //  Utterable aura names and the ambient prelude's types and traits
  //  (lib/jock.hoon +prelude, +p-tex-prim).  `Self` is the trait
  //  self-type; `self` is deliberately absent — language.md §6 is
  //  emphatic that it is an ordinary parameter name, not a keyword,
  //  so it highlights as the ordinary name it is.
  var TYPES_AURA = ['Atom', 'Bool', 'Hex', 'Sint', 'Real', 'Real16',
                    'Real32', 'Real128', 'Date', 'Span', 'Char',
                    'String', 'Path', 'Base'];
  var TYPES_PRELUDE = ['List', 'Map', 'Set', 'Octs', 'Effect', 'Self',
                       'Str', 'Kernel', 'Roof', 'Meas', 'Has', 'Idx',
                       'Put', 'Del', 'Add', 'Sub', 'Mul', 'Div', 'Lt',
                       'Lte', 'Gt', 'Gte', 'Eq', 'Show'];

  //  Names the compiler intercepts before gate resolution (+mint:mint):
  //  call-shaped, but no gate exists to resolve.  peekContext is the
  //  namespace read (Nock 12); peekUnder reads under a caller-supplied
  //  roof.  Neither is a keyword — `peekContext` shadows like any name.
  var BUILTINS = ['peekContext', 'peekUnder'];

  //  $jpunc, single-byte members.
  var PUNCS = '.;,:&$@?!~(){}[]=<>#+-*/%_^|\\';

  //  The multi-byte punctuator glyphs (+unis:lex), each an ASCII-first
  //  operator's sugar alias.  `⊛` is the one with no ASCII spelling and
  //  no pinned arm: trait-only, meaning supplied by a library.
  var UNI = ['×', '÷', '±', '⊕', '⊗', '⊖',
             '∘', '·', '∩', '∪', '∈', '⊂',
             '⊃', '⊛'];

  var KW = toSet(KEYWORDS);
  var TY = toSet(TYPES_AURA.concat(TYPES_PRELUDE));
  var BI = toSet(BUILTINS);

  function toSet(xs) {
    var s = {}, i;
    for (i = 0; i < xs.length; i++) s[xs[i]] = true;
    return s;
  }

  //  Diagnostics.  Tag and text are the compiler's own, so a reader
  //  who hovers an error here and then hits it in the compiler sees
  //  the same words twice.
  var HINTS = {
    'lex-whitespace':   'tab and carriage return are lexical errors; use spaces and LF',
    'lex-stray':        'stray character: not in the punctuator inventory',
    'lex-quote-open':   'unterminated string literal',
    'lex-quote-newline': 'a string literal may not span a newline',
    'lex-comment-open': 'unterminated block comment',
    'lex-interp-str':   'no string literal inside an interpolation fragment',
    'lex-interp-brace': 'a bare } in a string is an error; write }} for a literal brace',
    'parse-unglued-call':  'f (x) does not call f; write f(x) to call, or ; to sequence',
    'parse-unglued-index': 'xs [0] does not index xs; write xs[0] to index, or ; to sequence',
    'parse-minus-glue': 'a-1 and a -1 are reserved; write a - 1 to subtract',
    'parse-lark-cmp':   'p.>= is the lark p.> then =; write p.> >= 3 to compare, or p.> = 3 to assign'
  };

  //  ---------------------------------------------------------------
  //  Stage 1:  text -> tokens.  A port of +tokenize:lex.
  //  ---------------------------------------------------------------
  //
  //  Every token carries {k, t, glued, line, col}; whitespace and
  //  comments are tokens too (kind 'ws' and 'comment'), so the stream
  //  concatenates back to the source exactly.  That total coverage is
  //  what tools/hilite.py's round-trip assertion checks, and it is
  //  what makes the renderer incapable of dropping source text.

  function tokenize(src) {
    var toks = [];
    var i = 0, line = 1, col = 1;
    //  glued: %.n after whitespace or a comment, %.y otherwise.  A
    //  token after a comment is never glued (lex.hoon's contract).
    var glued = false;
    var n = src.length;

    function emit(kind, len, extra) {
      var text = src.substr(i, len);
      var tok = { k: kind, t: text, glued: glued, line: line, col: col };
      if (extra) for (var key in extra) tok[key] = extra[key];
      toks.push(tok);
      step(text);
      glued = (kind !== 'ws' && kind !== 'comment');
      return tok;
    }

    function step(text) {
      for (var j = 0; j < text.length; j++) {
        if (text.charCodeAt(j) === 10) { line++; col = 1; }
        else col++;
      }
      i += text.length;
    }

    function isDig(c) { return c >= '0' && c <= '9'; }
    function isLow(c) { return c >= 'a' && c <= 'z'; }
    function isCap(c) { return c >= 'A' && c <= 'Z'; }
    function isAln(c) { return isDig(c) || isLow(c) || isCap(c); }
    function isHex(c) {
      return isDig(c) || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
    }

    while (i < n) {
      var c = src[i];

      //  separators.  Space and LF only: tab and CR are errors, the
      //  language's refusal of invisible-whitespace ambiguity.
      if (c === ' ' || c === '\n') {
        var w = 1;
        while (i + w < n && (src[i + w] === ' ' || src[i + w] === '\n')) w++;
        emit('ws', w);
        continue;
      }
      if (c === '\t' || c === '\r') { emit('error', 1, { why: 'lex-whitespace' }); continue; }

      //  comments.  A `// expect:` trailer is the pinned value every
      //  example in examples/ carries and CI checks, so it earns its
      //  own class rather than washing out with the prose.
      if (c === '/' && src[i + 1] === '/') {
        var e = src.indexOf('\n', i);
        if (e < 0) e = n;
        var body = src.slice(i, e);
        emit('comment', e - i, { expect: /^\/\/\s*expect:/.test(body) });
        continue;
      }
      if (c === '/' && src[i + 1] === '*') {
        var close = src.indexOf('*/', i + 2);
        if (close < 0) { emit('error', n - i, { why: 'lex-comment-open' }); continue; }
        emit('comment', close + 2 - i);
        continue;
      }

      //  string literals, with interpolation.  `{expr}` splits the
      //  literal and the fragment is tokenized recursively (the parser
      //  does exactly this: +p-prim re-enters +tokenize:lex per part);
      //  `{{` and `}}` are literal braces and are not a general escape.
      if (c === '"') { lexString(); continue; }

      //  a char literal: 'a', aura chars.  No escapes in 1.0.
      if (c === "'") {
        var q = i + 1, bad = null;
        while (q < n && src[q] !== "'") {
          if (src[q] === '\n') { bad = 'lex-quote-newline'; break; }
          q++;
        }
        if (bad) { emit('error', q - i, { why: bad }); continue; }
        if (q >= n) { emit('error', n - i, { why: 'lex-quote-open' }); continue; }
        emit('char', q + 1 - i);
        continue;
      }

      //  numeric literals: 0x hex first, then decimal, then the
      //  digit-dot-digit real.  `.` is never a digit separator —
      //  grouping is `_`, and only between digits.
      if (c === '0' && src[i + 1] === 'x') {
        var h = i + 2;
        while (h < n && (isHex(src[h]) || src[h] === '_')) h++;
        emit('number', h - i, { sub: 'hex' });
        continue;
      }
      if (isDig(c)) {
        var d = i;
        while (d < n && (isDig(src[d]) || src[d] === '_')) d++;
        //  a real is digit-dot-digit, both sides required
        if (src[d] === '.' && isDig(src[d + 1] || '')) {
          var f = d + 1;
          while (f < n && isDig(src[f])) f++;
          emit('number', f - i, { sub: 'real' });
        } else {
          emit('number', d - i, { sub: 'decimal' });
        }
        continue;
      }

      //  %-constants: %foo is a term, %1 is the constant 1, and a
      //  bare % is the modulus punctuator.
      if (c === '%') {
        var nx = src[i + 1] || '';
        if (isDig(nx)) {
          var m = i + 1;
          while (m < n && (isDig(src[m]) || src[m] === '_')) m++;
          emit('number', m - i, { sub: 'decimal' });
          continue;
        }
        if (isLow(nx)) {
          var t = i + 1;
          while (t < n && isAln(src[t])) t++;
          //  term spellings are [a-z][a-z0-9]*; a capital inside is
          //  the lexer's %lex-term refusal
          var word = src.slice(i + 1, t);
          if (/[A-Z]/.test(word)) emit('error', t - i, { why: 'lex-term' });
          else emit('term', t - i);
          continue;
        }
        emit('op', 1);
        continue;
      }

      //  names, keywords, type names, boolean literals.  The casing
      //  split is grammar, not style: lower-case initial is a name,
      //  upper-case initial is a type name.
      if (isLow(c) || isCap(c)) {
        var w2 = i;
        while (w2 < n && isAln(src[w2])) w2++;
        var name = src.slice(i, w2);
        var kind;
        if (isCap(c)) kind = TY[name] ? 'type-builtin' : 'type';
        else if (name === 'true' || name === 'false') kind = 'bool';
        else if (KW[name]) kind = 'keyword';
        else if (BI[name]) kind = 'builtin';
        else kind = 'name';
        emit(kind, w2 - i);
        continue;
      }

      //  two-byte punctuators, maximal munch before their prefixes.
      //  Both are single tokens, which is why neither `->` nor `=>`
      //  ever arrives at the parser as a bare `=` or `-`.
      if (c === '-' && src[i + 1] === '>') { emit('op', 2); continue; }
      if (c === '=' && src[i + 1] === '>') { emit('op', 2); continue; }

      //  the multi-byte glyph operators
      if (UNI.indexOf(c) >= 0) { emit('op', 1); continue; }

      //  single-byte punctuators, from the mold
      if (PUNCS.indexOf(c) >= 0) {
        if (c === '~') emit('null', 1);
        else if (c === '@') emit('type-builtin', 1);
        else if ('()[]{},;:.'.indexOf(c) >= 0) emit('punc', 1);
        else emit('op', 1);
        continue;
      }

      emit('error', 1, { why: 'lex-stray' });
    }

    //  +gistr:lex — scan a "…" literal, splitting interpolations.
    //  The parts land on the token so the renderer can colour the
    //  fragments as code without losing the literal's own extent.
    function lexString() {
      var start = i, j = i + 1, seg = i, parts = [], why = null;
      while (true) {
        if (j >= n) { why = 'lex-quote-open'; break; }
        var ch = src[j];
        if (ch === '\n') { why = 'lex-quote-newline'; break; }
        if (ch === '"') { j++; break; }
        if (ch === '{' && src[j + 1] === '{') { j += 2; continue; }
        if (ch === '}' && src[j + 1] === '}') { j += 2; continue; }
        if (ch === '}') { why = 'lex-interp-brace'; break; }
        if (ch === '{') {
          //  brace-nesting is counted; an inner string literal or a
          //  newline refuses loudly (v1 fragment restrictions)
          var dep = 1, f = j + 1;
          while (f < n && dep > 0) {
            if (src[f] === '"') { why = 'lex-interp-str'; break; }
            if (src[f] === '\n') { why = 'lex-quote-newline'; break; }
            if (src[f] === '{') dep++;
            if (src[f] === '}') dep--;
            if (dep > 0) f++;
          }
          if (why) break;
          if (dep > 0) { why = 'lex-quote-open'; break; }
          parts.push({ k: 'str', t: src.slice(seg, j) });
          parts.push({ k: 'interp-brace', t: '{' });
          parts.push({ k: 'interp', toks: tokenize(src.slice(j + 1, f)) });
          parts.push({ k: 'interp-brace', t: '}' });
          j = f + 1;
          seg = j;
          continue;
        }
        j++;
      }
      if (why) { emit('error', Math.max(1, j - start), { why: why }); return; }
      if (parts.length) {
        parts.push({ k: 'str', t: src.slice(seg, j) });
        emit('string', j - start, { parts: parts });
      } else {
        emit('string', j - start);
      }
    }

    return adjacency(toks);
  }

  //  ---------------------------------------------------------------
  //  Stage 2:  the adjacency layer (+p-post:parse).
  //  ---------------------------------------------------------------
  //
  //  Everything here reads the `glued` flag and nothing else, which is
  //  the parser's own discipline.  Four judgments:
  //
  //    - a glued postfix `(` `[` `{` binds; an un-glued `(` or `[`
  //      after a complete expression is the adjacency law's refusal
  //    - binary `-` is spaced on both sides
  //    - a `.` leads a lark run (`.<` `.>`) or an axis (`.+5`), and a
  //      glued `=` after one is the mistyped-comparator refusal
  //    - a `/` in operand position leads a path literal

  //  Token kinds that complete an expression — the left operand a
  //  postfix form would attach to.
  var ENDERS = toSet(['name', 'fn', 'type', 'type-builtin', 'builtin',
                      'number', 'string', 'char', 'term', 'bool', 'null',
                      'lark', 'path']);

  function adjacency(toks) {
    var k, tok, prev, next;

    for (k = 0; k < toks.length; k++) {
      tok = toks[k];
      prev = prevSig(toks, k);
      next = nextSig(toks, k);

      //  a lark run or an axis:  `.` then < > … or + <number>
      if (tok.k === 'punc' && tok.t === '.' && prev && ENDERS[prev.k]) {
        var run = lark(toks, k);
        if (run > 0) {
          for (var m = k; m <= run; m++) toks[m].k = 'lark';
          //  a GLUED = right after the run is a mistyped comparator:
          //  `p.>= 3` would otherwise parse as the lark then an
          //  assignment — a silent reinterpretation
          var after = toks[run + 1];
          if (after && after.glued && after.k === 'op' && after.t === '=') {
            after.k = 'error';
            after.why = 'parse-lark-cmp';
          }
          k = run;
          continue;
        }
      }

      //  a path literal:  /a/b/c, glued name segments.  In operand
      //  position only — with a left operand, `/` is division.
      if (tok.k === 'op' && tok.t === '/' && !(prev && ENDERS[prev.k])) {
        var end = path(toks, k);
        if (end > k) {
          for (var q = k; q <= end; q++) toks[q].k = 'path';
          k = end;
          continue;
        }
      }

      //  postfix binding, and the adjacency law's two refusals
      if (tok.k === 'punc' && (tok.t === '(' || tok.t === '[')) {
        if (prev && ENDERS[prev.k]) {
          if (tok.glued) {
            tok.k = 'glue';
            //  a name with a glued ( is being called
            if (prev.k === 'name' && tok.t === '(') prev.k = 'fn';
          } else {
            tok.k = 'error';
            tok.why = tok.t === '(' ? 'parse-unglued-call' : 'parse-unglued-index';
          }
        } else if (tok.glued && prev && prev.k === 'keyword' &&
                   (prev.t === 'func' || prev.t === 'impl')) {
          //  the generics binder rides the declaring keyword, and it
          //  is glued for the same reason a call is
          tok.k = 'glue';
        } else if (tok.glued && prev && prev.k === 'op' && prev.t === '$') {
          tok.k = 'glue';
        }
        continue;
      }
      //  a glued `{` after a type name is a struct literal; a free
      //  brace is a block, always, and is never a refusal
      if (tok.k === 'punc' && tok.t === '{' && tok.glued && prev &&
          (prev.k === 'type' || prev.k === 'type-builtin')) {
        tok.k = 'glue';
        continue;
      }

      //  `$(` re-enters the enclosing func or loop with edits
      if (tok.k === 'op' && tok.t === '$' && next && next.glued &&
          next.t === '(') {
        tok.k = 'keyword';
        continue;
      }

      //  binary `-` is SPACED on both sides.  Glued hyphen-adjacency
      //  is reserved on the left for hyphenated Term-style names and
      //  on the right for the operand-position Sint literal, so
      //  neither future can land as a reinterpretation of a legal
      //  program — which is why the glued spellings refuse today.
      if (tok.k === 'op' && tok.t === '-' && prev && ENDERS[prev.k]) {
        if (tok.glued || (next && next.glued)) {
          tok.k = 'error';
          tok.why = 'parse-minus-glue';
        }
      }
    }
    return toks;
  }

  //  a lark run: `<` and `>` after the dot, each glued after the
  //  first, read left to right outermost-first.  Returns the index of
  //  the last token in the run, or 0 for "not a lark".
  function lark(toks, k) {
    var j = k + 1, seen = 0;
    //  the axis form, .+5 — the + is required, and the number is
    //  always a literal (a computed axis is untypeable)
    if (toks[j] && toks[j].k === 'op' && toks[j].t === '+' &&
        toks[j + 1] && toks[j + 1].glued && toks[j + 1].k === 'number' &&
        toks[j + 1].sub === 'decimal') {
      return j + 1;
    }
    while (toks[j] && toks[j].k === 'op' &&
           (toks[j].t === '<' || toks[j].t === '>')) {
      if (seen > 0 && !toks[j].glued) break;
      seen++;
      j++;
    }
    return seen ? j - 1 : 0;
  }

  //  a path literal: repeated glued `/` name.
  function path(toks, k) {
    var j = k, end = k - 1;
    while (toks[j] && toks[j].k === 'op' && toks[j].t === '/' &&
           toks[j + 1] && toks[j + 1].glued && toks[j + 1].k === 'name') {
      end = j + 1;
      j += 2;
    }
    return end;
  }

  function prevSig(toks, k) {
    for (var j = k - 1; j >= 0; j--) {
      if (toks[j].k !== 'ws' && toks[j].k !== 'comment') return toks[j];
    }
    return null;
  }

  function nextSig(toks, k) {
    for (var j = k + 1; j < toks.length; j++) {
      if (toks[j].k !== 'ws' && toks[j].k !== 'comment') return toks[j];
    }
    return null;
  }

  //  ---------------------------------------------------------------
  //  Rendering
  //  ---------------------------------------------------------------

  //  CSS class per token kind.  `ws` and plain punctuation get no
  //  span at all — the fewer elements, the better a <pre> copies.
  var CLASS = {
    comment: 'j-com',
    keyword: 'j-kw',
    op: 'j-op',
    glue: 'j-glue',
    type: 'j-ty',
    'type-builtin': 'j-tyb',
    builtin: 'j-bi',
    fn: 'j-fn',
    name: null,
    number: 'j-num',
    bool: 'j-num',
    null: 'j-num',
    term: 'j-str',
    char: 'j-str',
    string: 'j-str',
    path: 'j-str',
    lark: 'j-lark',
    punc: null,
    error: 'j-err'
  };

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function attr(s) { return esc(s).replace(/"/g, '&quot;'); }

  function renderToks(toks) {
    var out = '', i, tok;
    for (i = 0; i < toks.length; i++) {
      tok = toks[i];
      if (tok.k === 'ws') { out += esc(tok.t); continue; }
      if (tok.k === 'error') {
        out += '<span class="j-err" title="' +
               attr((tok.why || '') + (HINTS[tok.why] ? ': ' + HINTS[tok.why] : '')) +
               '">' + esc(tok.t) + '</span>';
        continue;
      }
      if (tok.k === 'comment') {
        out += '<span class="j-com' + (tok.expect ? ' j-expect' : '') + '">' +
               esc(tok.t) + '</span>';
        continue;
      }
      if (tok.k === 'string' && tok.parts) {
        out += '<span class="j-str">';
        for (var p = 0; p < tok.parts.length; p++) {
          var part = tok.parts[p];
          if (part.k === 'str') out += esc(part.t);
          else if (part.k === 'interp-brace') out += '<span class="j-op">' + esc(part.t) + '</span>';
          else out += '<span class="j-interp">' + renderToks(part.toks) + '</span>';
        }
        out += '</span>';
        continue;
      }
      var cls = CLASS[tok.k];
      out += cls ? '<span class="' + cls + '">' + esc(tok.t) + '</span>' : esc(tok.t);
    }
    return out;
  }

  function render(src) { return renderToks(tokenize(src)); }

  //  the inverse of tokenize, for the round-trip assertion
  function flatten(toks) {
    var out = '', i, tok;
    for (i = 0; i < toks.length; i++) {
      tok = toks[i];
      out += tok.t;
    }
    return out;
  }

  //  ---------------------------------------------------------------
  //  Browser entry point
  //  ---------------------------------------------------------------

  //  Opt-in, by class or by data-lang: a <pre> holding Nock output or
  //  a shell transcript must not be lexed as Jock.
  var SELECTOR = 'pre.jock, code.jock, pre[data-lang="jock"], code[data-lang="jock"]';

  function highlightAll(root) {
    var scope = root || global.document;
    if (!scope || !scope.querySelectorAll) return;
    var nodes = scope.querySelectorAll(SELECTOR), i;
    for (i = 0; i < nodes.length; i++) highlight(nodes[i]);
  }

  function highlight(el) {
    if (el.getAttribute('data-jock-done')) return;
    //  textContent, so an already-escaped listing (&lt;, &amp;)
    //  arrives as the characters it stands for
    el.innerHTML = render(el.textContent);
    el.setAttribute('data-jock-done', '1');
  }

  var api = {
    tokenize: tokenize,
    render: render,
    flatten: flatten,
    highlight: highlight,
    highlightAll: highlightAll,
    KEYWORDS: KEYWORDS,
    PUNCS: PUNCS,
    UNI: UNI,
    TYPES: TYPES_AURA.concat(TYPES_PRELUDE),
    BUILTINS: BUILTINS
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.JockHighlight = api;

  if (global.document) {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', function () { highlightAll(); });
    } else {
      highlightAll();
    }
  }

})(typeof globalThis !== 'undefined' ? globalThis : this);
