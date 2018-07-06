import { Token, Punctuation, TokenType, TokenTypes } from '@src/typings';

interface TokenizerOptions {
  tabSize?: number;
}

export default function tokenizer (input: string, options: TokenizerOptions) {
  const { tabSize } = options;

  const accumulatedTokens: Token[] = [];

  let urlMode = false;
  let currChar: string;
  let nextChar: string;

  let cursorPosition: number;

  let lineNumber = 1;
  let columnNumber = 1;

  const appendToken = (tokenType: string, value: string, columnNumber: number): Token => {
    const generatedToken = {
      tokenType: tokenType as TokenType,
      tokenNumber: accumulatedTokens.length,
      lineNumber,
      columnNumber,
      value
    };
    accumulatedTokens.push(generatedToken);
    
    return generatedToken;
  }

  const getTokens = (input: string): Token[] => {
    for (cursorPosition = 0; cursorPosition < input.length; columnNumber++, cursorPosition++) {
      currChar = input[cursorPosition];
      nextChar = input[cursorPosition + 1];
    }

    const punctuationType = Punctuation[currChar];
    if (punctuationType !== null) {
      if (currChar === '\n') {
        appendToken(TokenTypes.Newline, currChar, columnNumber);
      }
    }

    return [];
  }
}