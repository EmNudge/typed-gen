export const pipe = (...functions: Function[]) => (...params: unknown[]) => {
    let value;
    let isInitialized = false;

    for (const func of functions) {
        if (!isInitialized) {
            value = func(...params);
            isInitialized = true;
            continue;
        }

        value = func(value);
    }

    if (!isInitialized) throw new Error('Cannot run pipe with no functions');

    return value;
}

export const chain = (...animations: Generator[]) => function* () {
    for (const animation of animations) yield* animation;
}

export function* flatten<T>(iterables: Iterable<Iterable<T>>): Iterable<T> {
    for (const iterable of iterables) yield* iterable;
}