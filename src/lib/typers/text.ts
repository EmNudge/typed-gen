export function* typeText(text: string, delay: number) {
  const delayFunc = typeof delay === 'function' ? delay : () => delay;

  for (let i = 0; i < text.length; i += 1) {
    yield [delayFunc(), text.slice(0, i)] as [number, string];
  }
}

export function* eraseText(text: string, delay: number) {
  const delayFunc = typeof delay === 'function' ? delay : () => delay;

  for (let i = text.length; i > 0; i -= 1) {
    yield [delayFunc(), text.slice(0, i)] as [number, string];
  }
  yield [delayFunc(), ''] as [number, string];;
}

export const holdFor = (frames = 10) => function* (text: string) {
  for (let i = 0; i < frames; i++) {
    yield text;
  }
}