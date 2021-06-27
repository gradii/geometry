import ts = require('typescript');
import { Visitor } from './helper';
// import {ReikiNode} from "./asts";
import { factory, VariableDeclaration } from 'typescript';

/**
 * @deprecated will use reiki ast node to transform
 * declare var transform
 */
export function commonImportTransform<T extends ts.Node>(/*typeChecker: TypeChecker*/): ts.TransformerFactory<T> {
  return (context: any) => {
    const reikiVisitor = new CommonImportTransformVisitor();

    const reikiVisit = (node: any) => {
      if (reikiVisitor.visit) {
        const visitedNode = reikiVisitor.visit(node);
        if (!visitedNode) {
          return node.visit(reikiVisitor);
        } else {
          return visitedNode;
        }
      }
    };

    const tsVisit = (node: ts.Node) => {
      if (reikiVisitor.visitTsNode) {
        const visitedNode = reikiVisitor.visitTsNode(node);
        if (visitedNode !== undefined) {
          return ts.visitEachChild(node, (child) => visit(child), context);
        } else {
          return factory.createNotEmittedStatement(node);
        }
      }

      return node;
    };

    const visit = (node: ts.Node) => {
      if ((node as ts.Node).kind > -1) {   //ts node
        return tsVisit(node as ts.Node);
      } /*else if (node instanceof ReikiNode) { // reiki node
        return reikiVisit(node)
      } */ else {
        return node;
      }
    };

    return (node) => ts.visitNode(node, visit);
  };
}

/**
 *
 */
export class CommonImportTransformVisitor implements Visitor {


  //common tools
  constructor() {
  }

  visit(node: Node, context: any = null): any {

  }

  visitTsNode(node: ts.Node) {
    switch (node.kind) {
      case ts.SyntaxKind.ExpressionStatement:
        return this.visitExpressionStatement(node as ts.ExpressionStatement);
      case ts.SyntaxKind.VariableStatement:
        return this.visitVariableStatement(node as ts.VariableStatement);
      default:
        return node;
    }
  }

  visitExpressionStatement(node: ts.ExpressionStatement) {
    const express = node.expression;
    if (ts.isStringLiteral(express)) {
      if (express.text.toLocaleLowerCase() === 'use strict') {
        return undefined;
      }
    }
    return node;
  }

  visitVariableStatement(node: ts.VariableStatement) {
    const declarationList = node.declarationList;
    if (ts.isVariableDeclarationList(declarationList)) {
      const visitedDeclarationList: Array<VariableDeclaration | undefined> = [];
      declarationList.declarations.forEach(it => {
        visitedDeclarationList.push(this.visitVariableDeclaration(it));
      });
      const visitedNode = factory.createVariableStatement(
        node.modifiers,
        factory.createVariableDeclarationList(visitedDeclarationList.filter(it => it !== undefined) as VariableDeclaration[]
        )
      );

      return visitedNode;
    }
    return node;
  }

  visitVariableDeclaration(node: ts.VariableDeclaration) {
    if (node.name && ts.isIdentifierOrPrivateIdentifier(node.name)) {
      if (node.name.text === '__importStar') {
        return undefined;
      } else if (node.name.text === '__makeTemplateObject') {
        return undefined;
      }
    }
    return node;
  }

  visitDeclaration() {

  }

  visitImportDeclaration() {

  }

}
