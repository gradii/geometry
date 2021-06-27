import ts = require('typescript');


export function checkTypescriptNode() {
  const visit = (node: ts.Node) => {
    return node;
  }

  return (context: any) => {
    return (node) => ts.visitNode(node, visit);
  }
}
