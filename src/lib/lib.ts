import { consumeDelay, withDelay, hold } from './animate.js';
import { pipe, chain, flatten } from './utils.js'
import { typeText, eraseText, eraseHtml } from './typers/index.js';

interface TypeOptionsConfig {
    text: string[];
    selector: string;
    delay?: number;
    speed?: number;
    holdFor?: number;
    onFinished?: (text: string[]) => void;
    onType?: (text: string) => void;
}
interface TypeOptions {
    text: string[];
    delay: number;
    element: Element;
    holdFor: number;
    onFinished: (text: string[]) => void;
    onType: (text: string) => void;
}
const getTypeOptions = (config: TypeOptionsConfig): TypeOptions => {
    if (!config.text) throw new Error('Need text to type!');

    const element = document.querySelector(config.selector);
    if (!element) throw new Error('No matching element for selector: ' + config.selector);

    return {
        text: config.text,
        // speed has a maximum of 1000 and is the inverse of delay
        delay: config.delay ?? (config.speed ?? 500) / 1000,
        element,
        holdFor: 500,
        onFinished: config.onFinished ?? (() => void 0),
        onType: config.onType ?? (() => void 0)
    }
};

const getTextIter = (text: string | string[], delayMs: number, holdFor: number) => {
    if (typeof text === 'string') {
        return typeText(text, delayMs);
    }

    const animations = text.map((string, i) => {
        if (i == 0) return flatten([typeText(string, delayMs), hold(string, holdFor)]);
        return flatten([
            eraseText(text[i - 1], delayMs),
            hold('', holdFor),
            typeText(string, delayMs),
            hold(string, holdFor),
        ]) as Iterable<[number, string]>;
    });

    return flatten(animations);
}

export async function type(options: TypeOptionsConfig) {
    const { delay, holdFor, element, onFinished, onType, text } = getTypeOptions(options);
    const iter = getTextIter(text, delay, holdFor);

    for await (const currText of consumeDelay(iter as any)) {
        element.textContent = currText;
        onType(currText);
    }

    onFinished(text);
}

// get first index that the 2 strings differ at.
function getDiffIndex(str1: string, str2: string): number {
    const minLen = Math.min(str1.length, str2.length);

    for (let i = 0; i < minLen; i++) {
        console.log(str1[i], str2[i]);

        if (str1[i] === str2[i]) continue;
        return i;
    }

    return minLen;
}