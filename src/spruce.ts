import { AbstractSyntaxTreeParser, AbstractSyntaxTree, ParserOptions, ParserSyntax } from '@src/typings';

export default class Spruce implements AbstractSyntaxTreeParser {
  parse (input: string, options: ParserOptions) {
    const {
      syntax
    } = options;

    if (this.validateSyntax(syntax)) {
      
    }
    
    return {} as AbstractSyntaxTree;
  }

  private validateSyntax (syntax: string) {
    return Object.keys(ParserSyntax).includes(syntax);
  }
}