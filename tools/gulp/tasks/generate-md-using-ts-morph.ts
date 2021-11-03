import * as fse from 'fs-extra';
import { dest, src, task, } from 'gulp';
import * as path from 'path';
import { join } from 'path';
import * as through2 from 'through2';
import * as ts from 'typescript';
import * as VinylFile from 'vinyl';
import { buildConfig } from '../../package-tools';
import { createGenerateMdSchema } from './generate-md/init-generate-md-db';
import { refactorGenerateMd } from './generate-md/refactor-generate-md';

import { Project } from 'ts-morph';

// const p = new Project();
// class VisitTestCase {
//   public codes: Array<{ code?: string, expect?: string, val?: string }> = [];
//
//   currentPrint = -1;
//
//   public output: string[] = [];
//
//   constructor(public node: ts.Node, public sourceFile: ts.SourceFile) {
//   }
//
//   traverse() {
//     const node = this.node;
//     if (ts.isArrowFunction(node) && ts.isBlock(node.body)) {
//       this._visitStatements(node.body.statements);
//     } else {
//       throw new Error('unknown test case');
//     }
//     this.print();
//     return this.output.join('\n');
//   }
//
//   get curr() {
//     return this.codes[this.currentPrint];
//   }
//
//   get next() {
//     return this.codes[this.currentPrint + 1];
//   }
//
//   advance() {
//     this.currentPrint++;
//   }
//
//   private write(str: string) {
//     this.output.push(str);
//   }
//
//   private writeLn() {
//     this.output.push('\n');
//   }
//
//   private print() {
//     this.advance();
//     if (this.curr) {
//       if(this.curr.code && this.curr.code.trim().length === 0) {
//         this.advance();
//       } else if (this.curr.code) {
//         this.write('```typescript');
//         this.printCodeStatement();
//         this.write('```');
//       } else if (this.curr.expect) {
//         this.writeLn();
//         this.write(`> | Reference | Looks Like | Value |`)
//         this.write(`> | ------ | ----- | ----- |`)
//         this.printExpect();
//       } else {
//         this.advance();
//       }
//     } else {
//       return;
//     }
//     this.print();
//   }
//
//   private printCodeStatement() {
//     while (this.curr && this.curr.code) {
//       this.output.push(this.curr.code!);
//       this.advance();
//     }
//   }
//
//   private printExpect() {
//     while (this.curr && this.curr.expect) {
//       this.output.push(`> | ${this.curr.expect} | ----- | ${this.curr.val} |`);
//       this.advance();
//     }
//   }
//
//
//   private _visit(node: ts.Node) {
//
//   }
//
//   private _visitExpect(node: ts.Node) {
//
//   }
//
//   private _visitStatements(statements: ts.NodeArray<ts.Statement>) {
//     for (let statement of statements) {
//       const code = this.sourceFile.text.slice(statement.pos, statement.end).trim();
//       if (
//         ts.isExpressionStatement(statement) &&
//         ts.isCallExpression(statement.expression)
//       ) {
//         if (/^expect/.exec(code)) {
//           this.codes.push({expect: 'xxx', val: 'yyy'});
//           continue;
//         }
//       }
//
//       this.codes.push({code});
//     }
//   }
// }
//


const projectDir = buildConfig.projectDir;
const outputDir  = join(buildConfig.outputDir, 'generate-md-using-ts-morph');

task('generate-md-using-ts-morph:dist', async () => {
  console.log(buildConfig.projectDir);

  // const p = new Project('')
  // await createGenerateMdSchema();


});
