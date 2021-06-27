export interface Visitor {
  visit?(node: Node, context: any): any;
}


// export function visitAll(visitor: Visitor, nodes: Node[], context: any = null): any[] {
//   const result: any[] = [];
//
//   const visit = visitor.visit ?
//     (ast: Node) => visitor.visit!(ast, context) || ast.visit(visitor, context) :
//     (ast: Node) => ast.visit(visitor, context);
//   nodes.forEach(ast => {
//     const astResult = visit(ast);
//     if (astResult) {
//       result.push(astResult);
//     }
//   });
//   return result;
// }



export function visitNode(node, visitor) {

}
