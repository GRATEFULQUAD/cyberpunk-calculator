// Safe math expression evaluator for the standard + scientific calculators.
// No eval()/Function() — hand-written tokenizer + recursive-descent parser.
// Supports: + - * / % ^ (power), unary minus, parentheses, decimals,
// functions (sin, cos, tan, asin, acos, atan, log, ln, sqrt, cbrt, abs),
// constants (pi, e), postfix factorial (!), and degrees/radians mode.

export type AngleMode = "deg" | "rad";

const FUNCTIONS = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "log",
  "ln",
  "sqrt",
  "cbrt",
  "abs",
]);

type Token =
  | { type: "num"; value: number }
  | { type: "op"; value: string }
  | { type: "lparen" }
  | { type: "rparen" }
  | { type: "func"; value: string }
  | { type: "const"; value: string }
  | { type: "factorial" };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = input.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");

  while (i < s.length) {
    const c = s[i];
    if (c === " ") {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const numStr = s.slice(i, j);
      if ((numStr.match(/\./g) || []).length > 1) {
        throw new Error("Invalid number");
      }
      tokens.push({ type: "num", value: parseFloat(numStr) });
      i = j;
      continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
      const word = s.slice(i, j);
      if (FUNCTIONS.has(word)) {
        tokens.push({ type: "func", value: word });
      } else if (word === "pi") {
        tokens.push({ type: "const", value: "pi" });
      } else if (word === "e") {
        tokens.push({ type: "const", value: "e" });
      } else {
        throw new Error(`Unknown identifier: ${word}`);
      }
      i = j;
      continue;
    }
    if (c === "(") {
      tokens.push({ type: "lparen" });
      i++;
      continue;
    }
    if (c === ")") {
      tokens.push({ type: "rparen" });
      i++;
      continue;
    }
    if (c === "!") {
      tokens.push({ type: "factorial" });
      i++;
      continue;
    }
    if ("+-*/^%".includes(c)) {
      tokens.push({ type: "op", value: c });
      i++;
      continue;
    }
    throw new Error(`Unexpected character: ${c}`);
  }
  return tokens;
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("Invalid factorial");
  if (n > 170) return Infinity;
  let result = 1;
  for (let k = 2; k <= n; k++) result *= k;
  return result;
}

class Parser {
  tokens: Token[];
  pos = 0;
  angleMode: AngleMode;

  constructor(tokens: Token[], angleMode: AngleMode) {
    this.tokens = tokens;
    this.angleMode = angleMode;
  }

  peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  next(): Token | undefined {
    return this.tokens[this.pos++];
  }

  parseExpression(): number {
    let value = this.parseTerm();
    while (this.peek()?.type === "op" && ["+", "-"].includes((this.peek() as any).value)) {
      const op = (this.next() as any).value;
      const rhs = this.parseTerm();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  }

  parseTerm(): number {
    let value = this.parseUnary();
    while (
      this.peek()?.type === "op" &&
      ["*", "/", "%"].includes((this.peek() as any).value)
    ) {
      const op = (this.next() as any).value;
      const rhs = this.parseUnary();
      if (op === "*") value = value * rhs;
      else if (op === "/") {
        if (rhs === 0) throw new Error("Division by zero");
        value = value / rhs;
      } else value = value % rhs;
    }
    return value;
  }

  parseUnary(): number {
    if (this.peek()?.type === "op" && (this.peek() as any).value === "-") {
      this.next();
      return -this.parseUnary();
    }
    if (this.peek()?.type === "op" && (this.peek() as any).value === "+") {
      this.next();
      return this.parseUnary();
    }
    return this.parsePower();
  }

  parsePower(): number {
    let base = this.parsePostfix();
    if (this.peek()?.type === "op" && (this.peek() as any).value === "^") {
      this.next();
      const exponent = this.parseUnary(); // right-assoc-ish, good enough
      base = Math.pow(base, exponent);
    }
    return base;
  }

  parsePostfix(): number {
    let value = this.parseAtom();
    while (this.peek()?.type === "factorial") {
      this.next();
      value = factorial(value);
    }
    return value;
  }

  parseAtom(): number {
    const tok = this.peek();
    if (!tok) throw new Error("Unexpected end of expression");

    if (tok.type === "num") {
      this.next();
      return tok.value;
    }
    if (tok.type === "const") {
      this.next();
      return tok.value === "pi" ? Math.PI : Math.E;
    }
    if (tok.type === "lparen") {
      this.next();
      const value = this.parseExpression();
      if (this.peek()?.type !== "rparen") throw new Error("Missing closing parenthesis");
      this.next();
      return value;
    }
    if (tok.type === "func") {
      this.next();
      let arg: number;
      if (this.peek()?.type === "lparen") {
        this.next();
        arg = this.parseExpression();
        if (this.peek()?.type !== "rparen") throw new Error("Missing closing parenthesis");
        this.next();
      } else {
        arg = this.parseUnary();
      }
      return this.applyFunction(tok.value, arg);
    }
    throw new Error("Unexpected token");
  }

  toRad(x: number): number {
    return this.angleMode === "deg" ? (x * Math.PI) / 180 : x;
  }

  fromRad(x: number): number {
    return this.angleMode === "deg" ? (x * 180) / Math.PI : x;
  }

  applyFunction(name: string, arg: number): number {
    switch (name) {
      case "sin":
        return Math.sin(this.toRad(arg));
      case "cos":
        return Math.cos(this.toRad(arg));
      case "tan":
        return Math.tan(this.toRad(arg));
      case "asin":
        return this.fromRad(Math.asin(arg));
      case "acos":
        return this.fromRad(Math.acos(arg));
      case "atan":
        return this.fromRad(Math.atan(arg));
      case "log":
        if (arg <= 0) throw new Error("Invalid log input");
        return Math.log10(arg);
      case "ln":
        if (arg <= 0) throw new Error("Invalid ln input");
        return Math.log(arg);
      case "sqrt":
        if (arg < 0) throw new Error("Invalid sqrt input");
        return Math.sqrt(arg);
      case "cbrt":
        return Math.cbrt(arg);
      case "abs":
        return Math.abs(arg);
      default:
        throw new Error(`Unknown function: ${name}`);
    }
  }
}

// Preprocess "%" following typical calculator semantics:
//  - "a op b %" where op is + or -   =>  b becomes (a * b / 100)
//  - otherwise a lone trailing "%"   =>  value / 100
function preprocessPercent(expr: string): string {
  // Handle patterns like 100+10% -> 100+(100*10/100)
  const pattern = /(-?\d+(?:\.\d+)?)\s*([+\-])\s*(-?\d+(?:\.\d+)?)\s*%/g;
  let result = expr.replace(pattern, (_match, a, op, b) => {
    return `${a}${op}(${a}*${b}/100)`;
  });
  // Any remaining standalone "number%" -> (number/100)
  result = result.replace(/(-?\d+(?:\.\d+)?)\s*%/g, "($1/100)");
  return result;
}

export function evaluateExpression(expr: string, angleMode: AngleMode = "deg"): number {
  if (!expr || !expr.trim()) return 0;
  const processed = preprocessPercent(expr);
  const tokens = tokenize(processed);
  const parser = new Parser(tokens, angleMode);
  const value = parser.parseExpression();
  if (parser.pos !== tokens.length) throw new Error("Unexpected trailing tokens");
  if (!Number.isFinite(value)) throw new Error("Result is not finite");
  return value;
}

export function safeFormat(value: number, precision = 10): string {
  if (!Number.isFinite(value)) return "Error";
  if (Object.is(value, -0)) value = 0;
  // Trim floating point noise
  const rounded = parseFloat(value.toPrecision(precision));
  if (Math.abs(rounded) >= 1e15 || (Math.abs(rounded) < 1e-9 && rounded !== 0)) {
    return rounded.toExponential(6);
  }
  return rounded.toString();
}
