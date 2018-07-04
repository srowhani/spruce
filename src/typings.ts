export enum Context {
  stylesheet = 'stylesheet',
}

export enum TokenType {
  SingleQuoteString,
  DoubleQuoteString,
  MultilineComment,
  SinglelineComment,
  Newline,
  Space,
  Tab,
  ExclamationMark,
  QuotationMark,
}

export interface Token {
  tokenNumber: number,
  lineNumber: number,
  columnNumber: number,
  type: TokenType,
  value: string,
}

export interface BaseSyntaxProvider {
  tokenize(input: string): void,
  parse(tokens: Token[], context: Context): void
}

