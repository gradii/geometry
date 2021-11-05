import { capitalCase, SqlLexer, SqlParser } from '@gradii/fedaco';
import { factory } from 'typescript';
import * as ts from 'typescript';

const prettier = require('prettier');

class VisitTestCase {

  public codes: Array<{ code?: string, expect?: string, predicate?: string, val?: string }> = [];

  currentPrint = -1;

  public output: string[] = [];

  initWeightMap = {
    createQuery: 0.1,
    create     : 0.1,
  };

  tokenMapInStatements: Record<string, number> = {
    where        : 0,
    useConnection: 0,
    orderBy      : 0,
    get          : 0,
    log          : 0,

    'toBe'          : 0,
    'expect'        : 0,
    'toEqual'       : 0,
    'toBeFalsy'     : 0,
    'toBeTruthy'    : 0,
    'toBeInstanceOf': 0,
    'toBeNull'      : 0,
    'toBeCalled'    : 0,
    'toBeUndefined' : 0,

    'fn'       : 0,
    'next'     : 0,
    'toPromise': 0,
    'pipe'     : 0,
    'tap'      : 0,
    'finalize' : 0,

    'await': 0,
    'push' : 0
  };

  tokenMapInExpect = {
    'toBe'          : 0,
    'expect'        : 0,
    'toEqual'       : 0,
    'toBeFalsy'     : 0,
    'toBeTruthy'    : 0,
    'toBeInstanceOf': 0,
    'toBeNull'      : 0,
    'toBeCalled'    : 0,
    'toBeUndefined' : 0,
    'id'            : 0,
    'length'        : 0,
    'head'          : 0,
    'isArray'       : 0,

    'await': 0
    // 'toBe'               : 0, 'expect': 0, 'id': 0,
    // 'email'              : 1, 'toEqual': 0, 'count': 1,
    // 'newQuery'           : 1, 'toBeFalsy': 0, 'doesntExist': 1,
    // 'where'              : 1, 'toBeTruthy': 0, 'toBeInstanceOf': 0,
    // 'toBeUndefined'      : 1, 'isArray': 1, 'length': 0,
    // 'items'              : 1, 'getCountForPagination': 1, 'name': 1,
    // 'toBeNull'           : 1, 'not': 1, 'createQuery': 0,
    // 'useConnection'      : 1, '_exists': 1, 'getConnectionName': 1,
    // '_wasRecentlyCreated': 1, 'toBeCalled': 1, 'pluck': 1,
    // 'post'               : 1, 'user': 1, 'friends': 1,
    // 'head'               : 1, 'max': 1, 'min': 1,
    // 'posts'              : 1, 'childPosts': 1, 'parentPost': 1,
    // 'photos'             : 1, 'imageable': 0, 'getAttribute': 1,
    // 'morphMap'           : 1, 'saveOrFail': 1, 'json': 1,
    // 'toArray'            : 1, 'isNumber': 1, 'fresh': 1,
    // 'first'              : 1, 'level': 1, 'await': 1,
    // 'find'               : 1, 'friend': 1, 'is': 1,
    // 'fromDateTime'       : 1, 'isIgnoringTouch': 1,
  };

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
            '.toBeInstanceOf': 'instance type exactly match',
            '.toEqual'       : 'match',
          };
          const valueMap                 = {
            'Truthy();': 'true',
            'Falsy();' : 'false',
            'Null();'  : 'null'
          };
          let [expect, predicate, value] = code.split(
            /(\.toBeFalsy|\.toBeInstanceOf|\.not.toBe|\.toBe|\.toEqual)/g);
          expect                         = expect.replace(/^expect\((.+)\)$/s, '$1').replace('\n',
            '');

          predicate = predicateMap[predicate] || predicate;
          value     = value.replace(/^\((.+)\);?$/, '$1');
          value     = valueMap[value] || value;

          this.codes.push({expect: expect, predicate, val: value});
          this._trackToken(code, this.tokenMapInExpect, true);
          continue;
        } else if (code.includes('expect')) {
          continue;
        } else {
          this._trackToken(code, this.tokenMapInStatements);
        }
      } else {
        this._trackToken(code, this.tokenMapInStatements);
      }

      this.codes.push({code: code.replace(/ as BelongsToMany| as HasMany/g, '')});
    }
  }

  _trackToken(code: string, rst: Record<string, number>, notProperty = false) {
    const sourceFile = ts.createSourceFile(
      'test.ts', code, ts.ScriptTarget.Latest, true
    );

    ts.transform(sourceFile, [
      (context) => {
        const visit: ts.Visitor = (node) => {
          if (ts.isDecorator(node)) {
            return undefined;
          }

          let key;
          if (ts.isCallExpression(node) &&
            ts.isPropertyAccessExpression(node.expression) &&
            ts.isIdentifier(node.expression.name)) {
            key = node.expression.name.text;
          }

          if (
            ts.isCallExpression(node) &&
            ts.isIdentifier(node.expression)
          ) {
            key = node.expression.text;
          }
          // if (
          //   !notProperty &&
          //   ts.isPropertyAccessExpression(node) &&
          //   ts.isIdentifier(node.name)) {
          //   key = node.name.text;
          // }

          if (key) {
            if (!(key in rst)) {
              rst[key] = this.initWeightMap[key] || 1.1;
            } else {
              rst[key] *= 1.1;
            }
          }

          return ts.visitEachChild(node, (child) => visit(child), context);
        };

        return (node) => ts.visitNode(node, visit);
      }
    ]);
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
        const visitTestCase                        = new VisitTestCase(
          node.expression.arguments[1],
          sourceFile);
        const content                              = visitTestCase.traverse();
        const resultWeight: Record<string, number> = {};
        for (const [key, weight] of Object.entries(visitTestCase.tokenMapInExpect)) {
          if (weight > 0) {
            if (key in resultWeight) {
              resultWeight[key] *= weight;
            } else {
              resultWeight[key] = weight;
            }
          }
        }
        for (const [key, weight] of Object.entries(visitTestCase.tokenMapInStatements)) {
          if (weight > 0) {
            if (key in resultWeight) {
              resultWeight[key] *= weight;
            } else {
              resultWeight[key] = weight;
            }
          }
        }

        let highWeightOnly = false;
        const rst          = Object.entries(resultWeight).map(([key, weight]) => {
          if (weight > 1) {
            highWeightOnly = true;
          }
          return {key, weight};
        }).filter(it => {
          if (highWeightOnly) {
            return it.weight > 1;
          } else {
            return true;
          }
        });

        const testName    = node.expression.arguments[0].text.trim().replace(/^test\s*|\s*test$/,
          '');
        const testContent = `### ${testName}

${content}`;
        if (rst.length > 0) {
          rst.forEach(it => {
            generateContext.files.push({
              namedKey: it.key,
              fileName: testName,
              content : testContent
            });
          });
        } else {
          generateContext.files.push({
            fileName: testName,
            content : testContent
          });
        }


      }

      return ts.visitEachChild(node, (child) => visit(child), context);
    };

    return (node) => ts.visitNode(node, visit);
  };
}
