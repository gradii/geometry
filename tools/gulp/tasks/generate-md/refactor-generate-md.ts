import * as ts from 'typescript';


export function refactorGenerateMd<T extends ts.Node>(/*typeChecker: TypeChecker*/
                                                      generateContext: any): ts.TransformerFactory<T> {
  generateContext.files = [];

  return (context) => {
    const visit: ts.Visitor = (node) => {
      if (ts.isDecorator(node)) {
        return undefined;
      }

      if (ts.isImportDeclaration(node)) {
        return undefined;
      }

      if (
        ts.isExpressionStatement(node) &&
        ts.isCallExpression(node.expression) &&
        node.expression.arguments.length === 2 &&
        ts.isStringLiteral(node.expression.arguments[0])
      ) {
        generateContext.files.push({
          fileName: node.expression.arguments[0].text
        });
      }

      return ts.visitEachChild(node, (child) => visit(child), context);
    };

    return (node) => ts.visitNode(node, visit);
  };
}
