export interface AbstractSyntaxTree {
  diff(other: AbstractSyntaxTree): AbstractSyntaxTree;
}


export const TokenTypes = {
  SingleQuoteString: 'SingleQuoteString',
  DoubleQuoteString: 'DoubleQuoteString',
  Space: 'Space',
  Newline: 'Newline',
  Tab: 'Tab',
};

export type TokenType = keyof typeof TokenTypes;

export const Punctuation: { [index: string]: string } = {
  ' ': TokenTypes.Space,
  '\n': TokenTypes.Newline,
  '\r': TokenTypes.Newline,
  '\t': TokenTypes.Tab,
}

export interface Token {
  tokenType: TokenType,
  tokenNumber: number,
  lineNumber: number,
  columnNumber: number,
  value: string,
};

export const NodeTypes = {
  ArgumentsType: 'arguments',
  AtkeywordType: 'atkeyword',
  AtruleType: 'atrule',
  AttributeSelectorType: 'attributeSelector',
  AttributeNameType: 'attributeName',
  AttributeFlagsType: 'attributeFlags',
  AttributeMatchType: 'attributeMatch',
  AttributeValueType: 'attributeValue',
  BlockType: 'block',
  BracketsType: 'brackets',
  ClassType: 'class',
  CombinatorType: 'combinator',
  CommentMLType: 'multilineComment',
  CommentSLType: 'singlelineComment',
  ConditionType: 'condition',
  ConditionalStatementType: 'conditionalStatement',
  CustomPropertyType: 'customProperty',
  DeclarationType: 'declaration',
  DeclDelimType: 'declarationDelimiter',
  DefaultType: 'default',
  DelimType: 'delimiter',
  DimensionType: 'dimension',
  EscapedStringType: 'escapedString',
  ExtendType: 'extend',
  ExpressionType: 'expression',
  FunctionType: 'function',
  FunctionsListType: 'functionsList',
  GlobalType: 'global',
  IdentType: 'ident',
  ImportantType: 'important',
  IncludeType: 'include',
  InterpolationType: 'interpolation',
  InterpolatedVariableType: 'interpolatedVariable',
  KeyframesSelectorType: 'keyframesSelector',
  LoopType: 'loop',
  MixinType: 'mixin',
  NamePrefixType: 'namePrefix',
  NamespacePrefixType: 'namespacePrefix',
  NamespaceSeparatorType: 'namespaceSeparator',
  NumberType: 'number',
  OperatorType: 'operator',
  OptionalType: 'optional',
  ParenthesesType: 'parentheses',
  ParentSelectorType: 'parentSelector',
  ParentSelectorExtensionType: 'parentSelectorExtension',
  PercentageType: 'percentage',
  PlaceholderType: 'placeholder',
  ProgidType: 'progid',
  PropertyType: 'property',
  PropertyDelimType: 'propertyDelimiter',
  PseudocType: 'pseudoClass',
  PseudoeType: 'pseudoElement',
  RawType: 'raw',
  RulesetType: 'ruleset',
  SType: 'space',
  SelectorType: 'selector',
  ShashType: 'id',
  StringType: 'string',
  StylesheetType: 'stylesheet',
  TypeSelectorType: 'typeSelector',
  UnicodeRangeType: 'unicodeRange',
  UniversalSelectorType: 'universalSelector',
  UriType: 'uri',
  UrangeType: 'urange',
  ValueType: 'value',
  VariableType: 'variable',
  VariablesListType: 'variablesList',
  VhashType: 'color'
};

export type NodeType = keyof typeof NodeTypes;

export interface Node extends AbstractSyntaxTree {
  content: Node[] | string,
  type: NodeType,
  contains(type: string): boolean,
  every(type: string, callback: () => void): void;
}

export enum TokenizedSymbols {
  arguments = 'arguments',
  atkeyword = 'atkeyword',
  atrule = 'atrule',
  attributeSelector = 'attributeSelector'
}

export type TokenizedSymbol = keyof typeof TokenizedSymbols;

export type Context = {
  [K in TokenizedSymbols]?: () => Node;
}

export type Groot = {
  [K in TokenizedSymbols]?: (treeNode: Node) => string;
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

export interface TokenizerOptions {
  tabSize?: number;
}

export interface TokenizerState {
  cursorPosition: number,
  lineNumber: number,
  columnNumber: number,
  urlMode: boolean,
  cc?: string,
  nc?: string,
}

type StateModifierFunction = (
  state: TokenizerState, 
  context?: {
    value?: string
  }
) => TokenizerState;

export interface AbstractTokenizer {

  getCurrentState(): TokenizerState;
  process(input: string): Token[];
  
  parseMultilineComment: StateModifierFunction;
  parseSinglelineComment: StateModifierFunction;
  parseWhitespace: StateModifierFunction;
  parseString: StateModifierFunction;
  parseEquality: StateModifierFunction;
  parseInequality: StateModifierFunction;
  parseNumber: StateModifierFunction;
  parseIdent: StateModifierFunction;
}