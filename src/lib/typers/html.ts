type Block = string | { tag: string } | { name: string, attr: string, blocks: Block[] };

const domWalker = (dom: ChildNode): Block[] => [...dom.childNodes as any].map(node => {
  if (node instanceof Text) return node.nodeValue!;
  const { outerHTML } = node as ChildNode & { outerHTML: string }
  if (!node.childNodes.length) return { tag: outerHTML };

  const attrRes = outerHTML.match(/<\S+\s(.+?)>/);
  return {
    name: (node as ChildNode & { localName: string }).localName,
    attr: attrRes ? attrRes[1] : '',
    blocks: [...domWalker(node)],
  };
});

function getBlocks(text: string) {
  const p = new DOMParser();
  const doc = p.parseFromString(text, 'text/html');

  return [...domWalker(doc.body)];
}

export function* typeBlocks(blocks: Block[]) {
  let str = '';

  for (const block of blocks) {
    // if we're in a text node, walk through as normal and then move on
    if (typeof block === 'string') {
      for (let i = 0; i < block.length; i++) {
        yield str + block.slice(0, i + 1);
      }
      str += block;
      continue;
    }

    // yield the entire tag at once if there are no children
    if ('tag' in block) {
      yield str += block.tag;
      continue;
    }

    let newStr = '';
    const { blocks, name, attr } = block;
    // if we're in a tag, recursively travel down and yield
    // the text surrounded by the current tag
    for (const text of typeBlocks(blocks)) {
      newStr = `${str}<${name}${attr}>${text}</${name}>`;
      yield newStr;
    }

    // once all the text in the tag is typed, it's safe to set the string.
    str = newStr;
  }
}

export function* eraseBlocks(blocks: Block[]) {
  // there's likely a better way, but this is honestly just easier.
  // If we travel backwards on each call to the generator, we end up 
  // doing a ton of work that we've already done.
  const pretypedBlocks = [...typeBlocks(blocks)];

  yield* pretypedBlocks.reverse();
}

export function* typeHtml(htmlText: string, delay: number) {
  const blocks = getBlocks(htmlText);
  const delayFunc = typeof delay === 'function' ? delay : () => delay;

  for (const str of typeBlocks(blocks)) {
    yield [delayFunc(), str];
  }
}

export function* eraseHtml(htmlText: string, delay: number) {
  const blocks = getBlocks(htmlText);
  const delayFunc = typeof delay === 'function' ? delay : () => delay;

  for (const str of eraseBlocks(blocks)) {
    yield [delayFunc(), str];
  }

  yield [delayFunc(), ''];
}