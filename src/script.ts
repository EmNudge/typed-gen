import { consumeDelay, withDelay, hold } from './lib/animate.js';
import { pipe, chain } from './lib/utils.js'
import { typeHtml, eraseHtml } from './lib/typers/index.js';
import { type } from './lib/lib.js';

function getEl() {
    const el = document.createElement('div');
    el.classList.add('typed');
    document.body.appendChild(el);
    return el;
}

;
(async () => {
    const el = getEl();
    el.style.whiteSpace = 'pre';

    const htmlText = 'hello <b>my</b> good and <i>beautiful</i> friend!! &copy;'
    const typeText = pipe(
        chain(
            typeHtml(htmlText, 50),
            hold(htmlText, 1000),
            eraseHtml(htmlText, 50),
        ),
        consumeDelay,
    );

    for await (const html of typeText(htmlText)) {
        el.innerHTML = html;
    }
    el.classList.add('blink');
})();

;
(async () => {
    const el = getEl();
    el.id = 'target-el';

    type({
        selector: '#target-el',
        delay: 20,
        text: [
            'This is text being typed with the simple API!',
            'It is similar to the one Typed.js uses, but you don\'t have to use it.'
        ],
    });

    el.classList.add('blink');
})();