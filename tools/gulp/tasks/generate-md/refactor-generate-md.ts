import { capitalCase } from '@gradii/fedaco';
import { factory } from 'typescript';
import * as ts from 'typescript';

const prettier = require('prettier');

class VisitTestCase {
  public codes: Array<{ code?: string, expect?: string, predicate?: string, val?: string }> = [];

  currentPrint = -1;

  public output: string[] = [];

  constructor(public node: ts.Node, public sourceFile: ts.SourceFile) {
  }

  traverse() {
    const node = this.node;
    if (ts.isArrowFunction(node) && ts.isBlock(node.body)) {
      this._visitStatements(node.body.statements);
    } else {
      throw new Error('unknown test case');
    }
    this.print();
    return this.output.join('\n');
  }

  get curr() {
    return this.codes[this.currentPrint];
  }

  get next() {
    return this.codes[this.currentPrint + 1];
  }

  advance() {
    this.currentPrint++;
  }

  private write(str: string) {
    this.output.push(str);
  }

  private writeLn() {
    this.output.push('\n');
  }

  private print() {
    this.advance();
    if (this.curr) {
      if(this.curr.code && this.curr.code.trim().length === 0) {
        this.advance();
      } else if (this.curr.code) {
        this.write('```typescript');

        const bak   = this.output;
        // this.output = [`funcion ()=>{`];
        this.output = [];
        this.printCodeStatement();
        // this.output.push(`};`)
        const codes = this.output.join('\n');

        const formated = prettier.format(codes, {
          parser       : 'babel-ts',
          trailingComma: 'none',
          tabWidth     : 2,
          semi         : true,
          singleQuote  : true,
        }).replace(/\/\/ @ts-ignore\n/g, '');
        bak.push(formated.trim());
        this.output = bak;

        this.write('```');
      } else if (this.curr.expect) {
        this.writeLn();
        this.write(`> | Reference | Looks Like | Value |`)
        this.write(`> | ------ | ----- | ----- |`)
        this.printExpect();
      } else {
        this.advance();
      }
    } else {
      return;
    }
    this.print();
  }

  private printCodeStatement() {
    while (this.curr && this.curr.code) {
      this.output.push(this.curr.code!);
      this.advance();
    }
  }

  private printExpect() {
    while (this.curr && this.curr.expect) {
      this.output.push(
        `> | \`${this.curr.expect}\` | ${this.curr.predicate} | \`${this.curr.val}\` |`);
      this.advance();
    }
  }


  private _visit(node: ts.Node) {

  }

  private _visitExpect(node: ts.Node) {

  }

  private _visitStatements(statements: ts.NodeArray<ts.Statement>) {
    for (let statement of statements) {
      const code = this.sourceFile.text.slice(statement.pos, statement.end).trim();
      if (
        ts.isExpressionStatement(statement) &&
        ts.isCallExpression(statement.expression)
      ) {
        if (/^expect/.exec(code)) {
          const predicateMap             = {
            '.toBe'          : 'exactly match',
            '.toBeFalsy'     : 'exactly match false',
            '.not.toBe'      : 'exactly not match',
            '.toBeInstanceOf': 'type exactly match',
            '.toEqual'       : 'match',
          };
          const valueMap                 = {
            'Truthy();': 'true',
            'Falsy();' : 'false',
          };
          let [expect, predicate, value] = code.split(
            /(\.toBeFalsy|\.toBeInstanceOf|\.not.toBe|\.toBe|\.toEqual)/g);
          expect                         = expect.replace(/^expect\((.+)\)$/s, '$1').replace('\n',
            '');

          predicate = predicateMap[predicate] || predicate;
          value     = value.replace(/^\((.+)\);?$/, '$1');
          value     = valueMap[value] || value;

          this.codes.push({expect: expect, predicate, val: value});
          continue;
        }
      }

      this.codes.push({code});
    }
  }
}


export function refactorGenerateMd<T extends ts.Node>(/*typeChecker: TypeChecker*/
                                                      generateContext: any,
                                                      sourceFile: ts.SourceFile): ts.TransformerFactory<T> {
  generateContext.path  = '';
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
        node.parent && ts.isSourceFile(node.parent) &&
        ts.isExpressionStatement(node) &&
        ts.isCallExpression(node.expression) &&
        node.expression.arguments.length === 2 &&
        ts.isStringLiteral(node.expression.arguments[0]) &&
        sourceFile.text.slice(
          node.expression.expression.pos,
          node.expression.expression.end
        ).trim() === 'describe'
      ) {
        generateContext.path = node.expression.arguments[0].text.replace(/^test\s*|\s*test$/, '');

        const statements = node.parent.statements.slice(node.parent.statements.indexOf(node) + 1);
        const printer    = ts.createPrinter({removeComments: true});

        statements.forEach(it => {
          if (ts.isClassDeclaration(it)) {

            const result = printer.printNode(
              ts.EmitHint.Unspecified,
              it,
              node.parent as ts.SourceFile
            );
            generateContext.prerequisites.push(
              {type: 'text', text: `### Define For ${capitalCase(it.name.text)}`},
              {type: 'code', code: result.trim()}
            );
          }
        });

      }

      if (
        ts.isExpressionStatement(node) &&
        ts.isCallExpression(node.expression) &&
        node.expression.arguments.length === 2 &&
        ts.isStringLiteral(node.expression.arguments[0]) &&
        sourceFile.text.slice(
          node.expression.expression.pos,
          node.expression.expression.end
        ).trim() === 'it'
      ) {
        const visitTestCase = new VisitTestCase(node.expression.arguments[1], sourceFile);
        const content       = visitTestCase.traverse();
        generateContext.files.push({
          fileName: node.expression.arguments[0].text.replace(/^test\s*|\s*test$/, ''),
          content : `## ${node.expression.arguments[0].text}

${content}`
        });
      }

      return ts.visitEachChild(node, (child) => visit(child), context);
    };

    return (node) => ts.visitNode(node, visit);
  };
}
