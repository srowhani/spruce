import { TokenType, TokenReducer, TokenizerState, Punctuation } from '@src/typings';


const ScssTokenReducer: ((input: string) => TokenReducer)[] = [
  (input: string) => ({
    name: 'parseMultilineComment',
    match: ({ cc, nc }) => cc === '/' && nc === '*',
    reduce (state) {
      let cursor = state.cursorPosition + 2;
      
      for (; cursor < input.length; cursor++) {
        if (input[cursor] === '*' && input[cursor + 1] === '/')
          break;
      }

      const commentBlock = input.substring(state.cursorPosition, cursor + 2);
      const commentLines = commentBlock.split('\n');
      
      let {
        lineNumber,
        columnNumber
      } = state;

      if (commentLines.length > 0) {
        lineNumber = state.lineNumber + commentLines.length - 1;
        columnNumber = state.columnNumber + commentLines[commentLines.length - 1].length
      } else {
        columnNumber = state.columnNumber + (cursor - state.cursorPosition);
      }

      return {
        ...state,
        lineNumber,
        columnNumber,
        accumulatedTokens: [...state.accumulatedTokens, {
          tokenType: TokenType.MultilineComment,
          lineNumber: state.lineNumber,
          columnNumber: state.columnNumber,
          value: commentBlock
        }]
      }
    }
  }),
  (input: string) => ({
    name: 'parseSinglelineComment',
    match: ({ cc, nc, urlMode }) => cc === '/' && nc === '/' && !urlMode,
    reduce (state) {
      let cursor = state.cursorPosition + 2;

      for (; cursor < input.length; cursor++) {
        if (input[cursor] === '\n' || input[cursor] === '\r')
          break;
      }

      return {
        ...state,
        columnNumber: state.columnNumber + (cursor - state.cursorPosition - 1),
        accumulatedTokens: [...state.accumulatedTokens, {
          tokenType: TokenType.SinglelineComment,
          lineNumber: state.lineNumber,
          columnNumber: state.columnNumber,
          value: input.substring(state.columnNumber, cursor - 1)
        }]
      }
    }
  }),
  (input: string) => ({
    name: 'parseString',
    match: ({ cc }) => cc === '\"' || cc === '\'',
    reduce (state) {
      const quoteSymbol = state.cc;

      let cursor = state.cursorPosition + 1;
      for (; cursor < input.length; cursor++) {
        if (input[cursor] == '\\') { 
          cursor += 1; // skip the next character (escaped quotes)
          continue;
        }

        if (input[cursor] === quoteSymbol) {
          break;
        }
      }

      return {
        ...state,
        cursorPosition: cursor,
        accumulatedTokens: [...state.accumulatedTokens, {
          tokenType: quoteSymbol === '\"' ? TokenType.DoubleQuoteString : TokenType.SingleQuoteString,
          columnNumber: state.columnNumber,
          lineNumber: state.lineNumber,
          value: input.substring(state.cursorPosition, cursor + 1)
        }]
      }
    }
  }),
  (input: string) => ({
    name: 'parseWhitespace',
    match: ({ cc }) => cc === ' ',
    reduce (state) {
      let cursor = state.cursorPosition;

      for (; cursor < input.length; cursor++) {
        if (input[cursor] !== ' ') {
          break;
        }
      }
  
      return {
        ...state,
        cursorPosition: cursor - 1,
        columnNumber: state.columnNumber + (cursor - state.cursorPosition),
        accumulatedTokens: [...state.accumulatedTokens, {
          tokenType: TokenType.Space,
          columnNumber: state.columnNumber,
          lineNumber: state.lineNumber,
          value: input.substring(state.cursorPosition, cursor),
        }]
      }
    }
  }),
  (input: string) => ({
    name: 'parseEquality',
    match: ({ cc, nc }) => cc === '=' && nc === '=',
    reduce (state) {
      return {
        ...state,
        cursorPosition: state.cursorPosition + 1,
        columnNumber: state.columnNumber + 1,
        accumulatedTokens: [
          ...state.accumulatedTokens,
          {
            tokenType: TokenType.EqualitySign,
            lineNumber: state.lineNumber,
            columnNumber: state.columnNumber,
            value: '==',
          }
        ]
      }
    }
  }),
  (input: string) => ({
    name: 'parseInequality',
    match: ({ cc, nc }) => cc === '!' && nc === '=',
    reduce (state) {
      return {
        ...state,
        cursorPosition: state.cursorPosition + 1,
        columnNumber: state.columnNumber + 1,
        accumulatedTokens: [...state.accumulatedTokens, {
          tokenType: TokenType.EqualitySign,
          lineNumber: state.lineNumber,
          columnNumber: state.columnNumber,
          value: '!=',
        }]
      }
    }
  }),
  (input: string) => ({
    name: 'parseNewline',
    match: ({ cc, nc }) => `${cc}${nc}` === '\r\n' || cc === '\n',
    reduce (state) {
      let {
        cursorPosition
      } = state;

      let value = '\n';

      if (state.cc === '\r') {
        value = '\r\n';
        cursorPosition += 1;
      }

      return {
        ...state,
        cursorPosition,
        lineNumber: state.lineNumber + 1,
        columnNumber: 0, // reset line
        accumulatedTokens: [...state.accumulatedTokens, {
          tokenType: TokenType.Newline,
          columnNumber: state.columnNumber,
          lineNumber: state.lineNumber,
          value,
        }]
      }
    }
  })
]

export default (input: string) => (previousState: TokenizerState) => {
  const resolvedReducer = ScssTokenReducer.find(reducer => reducer(input).match(previousState));
  return resolvedReducer !== undefined
    ? resolvedReducer(input).reduce(previousState)
    : previousState;
}