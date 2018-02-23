const visit = require('unist-util-visit');
const remark = require('remark');
const html = require('remark-html');

export class RenderMarkdown {
  private renderer: any;

  constructor() {
    this.renderer = remark()
      .use(transformExample)
      // .use(inlineTagDefs)
      // .use(noIndentedCodeBlocks)
      // .use(plainHTMLBlocks)
      // USEFUL DEBUGGING CODE
      // .use(() => tree => {
      //   console.log(require('util').inspect(tree, { colors: true, depth: 4 }));
      // })
      .use(html, /*{handlers}*/);
  }

  public markdown(content: string) {
    return this.renderer.processSync(content).toString();
  }
}

const EXAMPLE_PATTERN = /<!--\W*example\(([^)]+)\)\W*-->/g;

function transformExample() {
  return (tree: any) => {
    visit(tree, 'html', (node: any) => {
      node.value = node.value.replace(EXAMPLE_PATTERN, (_match: string, name: string) =>
        `<div material-docs-example="${name}"></div>`
      );
    });
  };
}
