const replaceRandomChar = (text: string, char: string) => {
  const randIndex = Math.floor(Math.random() * text.length);
  return text.slice(0, randIndex) + char + text.slice(randIndex + 1);
}

const getRandSymbol = () => String.fromCodePoint(65 + Math.floor(Math.random() * 60));

/**
 * takes in a string iterable and replaces random characters
 */
export function* decoder(stringIter: Iterable<string>) {
  let currStr: string = '';
  for (const string of stringIter) {
    currStr = string;
    const randChar = getRandSymbol();
    yield replaceRandomChar(string, randChar) + getRandSymbol();
  }

  yield currStr;
}
