import { AbstractSyntaxTreeParser, AbstractSyntaxTree, ParserOptions } from '@src/typings';

export default class Spruce implements AbstractSyntaxTreeParser {
  parse (input: string, options: ParserOptions) {
    return {} as AbstractSyntaxTree;
  }
}