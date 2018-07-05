export interface AbstractSyntaxTree {
  diff(other: AbstractSyntaxTree): AbstractSyntaxTree;
}

export interface Node extends AbstractSyntaxTree {
  contains(type: string): boolean,
  every(type: string, callback: () => void): void;
}

export enum ContextTypes {
  arguments = 'arguments',
  atkeyword = 'atkeyword',
  atrule = 'atrule',
  attributeSelector = 'attributeSelector'
}

export type Context = {
  [K in ContextTypes]?: () => Node;
}

export const ValidTokenTypes = {
  SingleQuoteString: 'SingleQuoteString',
  DoubleQuoteString: 'DoubleQuoteString',
  MultilineComment: 'MultilineComment',
  SinglelineComment: 'SinglelineComment',
  Newline: 'Newline',
  Space: 'Space',
  Tab: 'Tab',
  ExclamationMark: 'ExclamationMark',
  QuotationMark: 'QuotationMark',
}

type TokenType = keyof typeof ValidTokenTypes;

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

export enum ParserSyntax {
  scss = 'scss',
  sass = 'sass',
}

export interface ParserOptions {
  syntax: ParserSyntax
}

export interface AbstractSyntaxTreeParser {
  parse(input: string, options: ParserOptions): AbstractSyntaxTree;
}