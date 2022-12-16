type AnimationFrame = [number, string];
type Animation = Iterable<AnimationFrame>;

export const withDelay = (ms: number) => function* (framedString: Iterable<string>) {
    for (const frame of framedString) {
        yield [ms, frame] as AnimationFrame;
    }
}

export const delay = (ms: number) => function* (str: string) {
    yield [ms, str] as AnimationFrame;
}

export function* hold(text: string, ms: number) {
    yield [ms, text] as AnimationFrame;
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function* consumeDelay(animation: Animation) {
    for (const [ms, frame] of animation) {
        yield frame;
        await sleep(ms);
    }
}