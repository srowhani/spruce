import { AbstractTokenizer, Token, TokenizerOptions, TokenizerState, Punctuation, TokenType, TokenTypes } from '@src/typings';

export default class ScssTokenizer implements AbstractTokenizer {
  private state: TokenizerState;
  private options: TokenizerOptions;
  private input: string;

  private accumulatedTokens: Token[];

  constructor (options: TokenizerOptions) {
    this.input = "";
    this.options = options;
    this.state = {
      cursorPosition: 0,
      lineNumber: 1,
      columnNumber: 1,
      urlMode: false,
    };

    this.accumulatedTokens = [];
  }

  private push(tokenInfo: {tokenType: string, columnNumber: number, lineNumber: number, value: string}) {
    this.accumulatedTokens.push({
      ...tokenInfo,
      tokenType: tokenInfo.tokenType as TokenType,
      tokenNumber: this.accumulatedTokens.length,
    });
  }


  process (input: string) {
    let { state } = this;
    this.input = input;

    for (; state.cursorPosition < input.length; state.columnNumber++, state.cursorPosition++) {
      
      state.cc = input[state.cursorPosition];
      state.nc = input[state.cursorPosition + 1];

      const punctuationType = Punctuation[state.cc];
      
      if (state.cc === '/' && state.nc === '*') {
        state = { ...this.parseMultilineComment(state) };
      } 
      
      else if (state.cc === '/' && state.nc === '/' && !state.urlMode) {
        state = { ...this.parseSinglelineComment(state)};
      }

      else if (state.cc === '\"' || state.cc === '\'') {
        state = { ...this.parseString(state, { value: state.cc }) }
      }
      else if (state.cc === ' ') {
        state = { ...this.parseWhitespace(state) }
      }

      else if (punctuationType !== null) {
        if (state.cc === '\n') {
          this.push({
            tokenType: TokenTypes.Newline,
            value: state.cc,
            columnNumber: state.columnNumber,
            lineNumber: state.lineNumber,
          });
        }
      }
    }
    return this.accumulatedTokens;
  }

  getCurrentState () {
    return this.state;
  }

  incrementCursor (): TokenizerState {
    return {
      ...this.state,
      ...{
        lineNumber: this.state.lineNumber++,
        columnNumber: 0,
      }
    }
  }

  parseMultilineComment(currentState: TokenizerState) {
    return {} as TokenizerState;
  }

  parseSinglelineComment(currentState: TokenizerState) {
    return {} as TokenizerState;
  }

  parseWhitespace(currentState: TokenizerState): TokenizerState {
    const { input } = this;
    let pos = currentState.cursorPosition;

    for (; pos < input.length; pos++) {
      if (input[pos] !== ' ') {
        break;
      }
    }

    this.push({
      tokenType: TokenTypes.Space,
      columnNumber: currentState.columnNumber,
      lineNumber: currentState.lineNumber,
      value: input.substring(currentState.cursorPosition, pos--),
    });

    return {
      ...currentState,
      ...{
        cursorPosition: pos,
        columnNumber: currentState.columnNumber + (pos - currentState.cursorPosition),
      }
    }

  }

  parseString(currentState: TokenizerState, context: { value: string }) {
    const { input } = this;
    const quoteCharacter = context.value;
    let pos = currentState.cursorPosition + 1;

    for (; pos < input.length; pos++) {
      if (input[pos] === '\\') {
        pos += 1;
      } else if (input[pos] === quoteCharacter) {
        break;
      }
    }
    this.push({
      tokenType: quoteCharacter === '"' ? TokenTypes.DoubleQuoteString : TokenTypes.SingleQuoteString,
      columnNumber: currentState.columnNumber,
      lineNumber: currentState.lineNumber,
      value: input.substring(currentState.cursorPosition, pos + 1)
    });
   
    return {
      ...currentState,
      ...{
        cursorPosition: pos,
        columnNumber: currentState.columnNumber + (pos - currentState.cursorPosition)
      }
    }

  }
  parseEquality(currentState: TokenizerState) {
    return {} as TokenizerState
  }
  parseInequality(currentState: TokenizerState) {
    return {} as TokenizerState
  }
  parseNumber(currentState: TokenizerState) {
    return {} as TokenizerState
  }
  parseIdent(currentState: TokenizerState) {
    return {} as TokenizerState
  }

}