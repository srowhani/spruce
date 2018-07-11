import { AbstractTokenizer, Token, TokenizerOptions, TokenizerState, Punctuation, TokenType } from '@src/typings';
import createTokenReducer from './reducer';

export default class ScssTokenizer implements AbstractTokenizer {
  private initialState: TokenizerState;
  private options: TokenizerOptions;

  constructor (options: TokenizerOptions) {
    this.options = options;
    this.initialState = {
      accumulatedTokens: [],
      cursorPosition: 0,
      lineNumber: 1,
      columnNumber: 1,
      urlMode: false,
    };
  }

  process (input: string) {
    const tokenReducer = createTokenReducer(input);

    return input.split('')
      .reduce(
        (accumulatedState, _, cursorPosition) => ({
          ...tokenReducer({
            ...accumulatedState, 
            cc: input[cursorPosition],
            nc: input[cursorPosition + 1]
          })
        }),
        this.initialState
      );
  }
}