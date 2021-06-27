// import ts = require('typescript');
// import { visitNode } from './helper';
// import * as t from './asts';
// import { BigIntLiteral, NumericLiteral, TypeReferenceNode } from './asts';
// import { factory } from 'typescript';
// import { visit } from '@angular/compiler-cli/src/ngtsc/util/src/visitor';
//
// export class ConvertToReikiVisitor {
//   constructor() {
//
//   }
// }
//
//
// export function convertToReikiVisitor(typeChecker) {
//   return (context) => {
//     const reikiVisitor = new ConvertToReikiVisitor();
//     const visitor = (node) => {
//       return convertToReiki(node, visitor, context);
//     };
//
//     return (node) => visitNode(node, visitor);
//   };
// }
//
// export function convertToReiki(node,visitor, context) {
//   if (node === undefined) {
//     return undefined;
//   }
//
//   const kind = node.kind;
//
//   if ((kind > ts.SyntaxKind.FirstToken && kind <= ts.SyntaxKind.LastToken) || kind === ts.SyntaxKind.ThisType) {
//     return node;
//   }
//
//   switch (kind) {
//     // Names
//
//     case ts.SyntaxKind.Identifier:
//       return new Identifier(
//
//       )
//       return factory.updateIdentifier(<ts.Identifier>node,
//         nodesVisitor((<ts.Identifier>node).typeArguments, visitor, isTypeNodeOrTypeParameterDeclaration));
//
//     case ts.SyntaxKind.QualifiedName:
//       return factory.updateQualifiedName(<ts.QualifiedName>node,
//         nodeVisitor((<ts.QualifiedName>node).left, visitor, isEntityName),
//         nodeVisitor((<ts.QualifiedName>node).right, visitor, isIdentifier));
//
//     case ts.SyntaxKind.ComputedPropertyName:
//       return factory.updateComputedPropertyName(<ts.ComputedPropertyName>node,
//         nodeVisitor((<ts.ComputedPropertyName>node).expression, visitor, isExpression));
//
//     // Signature elements
//     case ts.SyntaxKind.TypeParameter:
//       return factory.updateTypeParameterDeclaration(<ts.TypeParameterDeclaration>node,
//         nodeVisitor((<ts.TypeParameterDeclaration>node).name, visitor, isIdentifier),
//         nodeVisitor((<ts.TypeParameterDeclaration>node).constraint, visitor, isTypeNode),
//         nodeVisitor((<ts.TypeParameterDeclaration>node).default, visitor, isTypeNode));
//
//     case ts.SyntaxKind.Parameter:
//       return factory.updateParameterDeclaration(<ts.ParameterDeclaration>node,
//         nodesVisitor((<ts.ParameterDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.ParameterDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.ParameterDeclaration>node).dotDotDotToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.ParameterDeclaration>node).name, visitor, isBindingName),
//         nodeVisitor((<ts.ParameterDeclaration>node).questionToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.ParameterDeclaration>node).type, visitor, isTypeNode),
//         nodeVisitor((<ts.ParameterDeclaration>node).initializer, visitor, isExpression));
//
//     case ts.SyntaxKind.Decorator:
//       return factory.updateDecorator(<ts.Decorator>node,
//         nodeVisitor((<ts.Decorator>node).expression, visitor, isExpression));
//
//     // Type elements
//     case ts.SyntaxKind.PropertySignature:
//       return factory.updatePropertySignature((<ts.PropertySignature>node),
//         nodesVisitor((<ts.PropertySignature>node).modifiers, visitor, isToken),
//         nodeVisitor((<ts.PropertySignature>node).name, visitor, isPropertyName),
//         nodeVisitor((<ts.PropertySignature>node).questionToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.PropertySignature>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.PropertyDeclaration:
//       return factory.updatePropertyDeclaration(<ts.PropertyDeclaration>node,
//         nodesVisitor((<ts.PropertyDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.PropertyDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.PropertyDeclaration>node).name, visitor, isPropertyName),
//         // QuestionToken and ExclamationToken is uniqued in Property Declaration and the signature of 'updateProperty' is that too
//         nodeVisitor((<ts.PropertyDeclaration>node).questionToken || (<ts.PropertyDeclaration>node).exclamationToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.PropertyDeclaration>node).type, visitor, isTypeNode),
//         nodeVisitor((<ts.PropertyDeclaration>node).initializer, visitor, isExpression));
//
//     case ts.SyntaxKind.MethodSignature:
//       return factory.updateMethodSignature(<ts.MethodSignature>node,
//         nodesVisitor((<ts.ParameterDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.MethodSignature>node).name, visitor, isPropertyName),
//         nodeVisitor((<ts.MethodSignature>node).questionToken, tokenVisitor, isToken),
//         nodesVisitor((<ts.MethodSignature>node).typeParameters, visitor, isTypeParameterDeclaration),
//         nodesVisitor((<ts.MethodSignature>node).parameters, visitor, isParameterDeclaration),
//         nodeVisitor((<ts.MethodSignature>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.MethodDeclaration:
//       return factory.updateMethodDeclaration(<ts.MethodDeclaration>node,
//         nodesVisitor((<ts.MethodDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.MethodDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.MethodDeclaration>node).asteriskToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.MethodDeclaration>node).name, visitor, isPropertyName),
//         nodeVisitor((<ts.MethodDeclaration>node).questionToken, tokenVisitor, isToken),
//         nodesVisitor((<ts.MethodDeclaration>node).typeParameters, visitor, isTypeParameterDeclaration),
//         visitParameterList((<ts.MethodDeclaration>node).parameters, visitor, context, nodesVisitor),
//         nodeVisitor((<ts.MethodDeclaration>node).type, visitor, isTypeNode),
//         visitFunctionBody((<ts.MethodDeclaration>node).body!, visitor, context, nodeVisitor));
//
//     case ts.SyntaxKind.Constructor:
//       return factory.updateConstructorDeclaration(<ts.ConstructorDeclaration>node,
//         nodesVisitor((<ts.ConstructorDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.ConstructorDeclaration>node).modifiers, visitor, isModifier),
//         visitParameterList((<ts.ConstructorDeclaration>node).parameters, visitor, context, nodesVisitor),
//         visitFunctionBody((<ts.ConstructorDeclaration>node).body!, visitor, context, nodeVisitor));
//
//     case ts.SyntaxKind.GetAccessor:
//       return factory.updateGetAccessorDeclaration(<ts.GetAccessorDeclaration>node,
//         nodesVisitor((<ts.GetAccessorDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.GetAccessorDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.GetAccessorDeclaration>node).name, visitor, isPropertyName),
//         visitParameterList((<ts.GetAccessorDeclaration>node).parameters, visitor, context, nodesVisitor),
//         nodeVisitor((<ts.GetAccessorDeclaration>node).type, visitor, isTypeNode),
//         visitFunctionBody((<ts.GetAccessorDeclaration>node).body!, visitor, context, nodeVisitor));
//
//     case ts.SyntaxKind.SetAccessor:
//       return factory.updateSetAccessorDeclaration(<ts.SetAccessorDeclaration>node,
//         nodesVisitor((<ts.SetAccessorDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.SetAccessorDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.SetAccessorDeclaration>node).name, visitor, isPropertyName),
//         visitParameterList((<ts.SetAccessorDeclaration>node).parameters, visitor, context, nodesVisitor),
//         visitFunctionBody((<ts.SetAccessorDeclaration>node).body!, visitor, context, nodeVisitor));
//
//     case ts.SyntaxKind.CallSignature:
//       return factory.updateCallSignature(<ts.CallSignatureDeclaration>node,
//         nodesVisitor((<ts.CallSignatureDeclaration>node).typeParameters, visitor, isTypeParameterDeclaration),
//         nodesVisitor((<ts.CallSignatureDeclaration>node).parameters, visitor, isParameterDeclaration),
//         nodeVisitor((<ts.CallSignatureDeclaration>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.ConstructSignature:
//       return factory.updateConstructSignature(<ts.ConstructSignatureDeclaration>node,
//         nodesVisitor((<ts.ConstructSignatureDeclaration>node).typeParameters, visitor, isTypeParameterDeclaration),
//         nodesVisitor((<ts.ConstructSignatureDeclaration>node).parameters, visitor, isParameterDeclaration),
//         nodeVisitor((<ts.ConstructSignatureDeclaration>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.IndexSignature:
//       return factory.updateIndexSignature(<ts.IndexSignatureDeclaration>node,
//         nodesVisitor((<ts.IndexSignatureDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.IndexSignatureDeclaration>node).modifiers, visitor, isModifier),
//         nodesVisitor((<ts.IndexSignatureDeclaration>node).parameters, visitor, isParameterDeclaration),
//         nodeVisitor((<ts.IndexSignatureDeclaration>node).type, visitor, isTypeNode));
//
//     // Types
//     case ts.SyntaxKind.TypePredicate:
//       return factory.updateTypePredicateNode(<ts.TypePredicateNode>node,
//         nodeVisitor((<ts.TypePredicateNode>node).assertsModifier, visitor),
//         nodeVisitor((<ts.TypePredicateNode>node).parameterName, visitor),
//         nodeVisitor((<ts.TypePredicateNode>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.TypeReference:
//       return factory.updateTypeReferenceNode(<ts.TypeReferenceNode>node,
//         nodeVisitor((<ts.TypeReferenceNode>node).typeName, visitor, isEntityName),
//         nodesVisitor((<ts.TypeReferenceNode>node).typeArguments, visitor, isTypeNode));
//
//     case ts.SyntaxKind.FunctionType:
//       return factory.updateFunctionTypeNode(<ts.FunctionTypeNode>node,
//         nodesVisitor((<ts.FunctionTypeNode>node).typeParameters, visitor, isTypeParameterDeclaration),
//         nodesVisitor((<ts.FunctionTypeNode>node).parameters, visitor, isParameterDeclaration),
//         nodeVisitor((<ts.FunctionTypeNode>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.ConstructorType:
//       return factory.updateConstructorTypeNode(<ts.ConstructorTypeNode>node,
//         nodesVisitor((<ts.ConstructorTypeNode>node).typeParameters, visitor, isTypeParameterDeclaration),
//         nodesVisitor((<ts.ConstructorTypeNode>node).parameters, visitor, isParameterDeclaration),
//         nodeVisitor((<ts.ConstructorTypeNode>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.TypeQuery:
//       return factory.updateTypeQueryNode((<ts.TypeQueryNode>node),
//         nodeVisitor((<ts.TypeQueryNode>node).exprName, visitor, isEntityName));
//
//     case ts.SyntaxKind.TypeLiteral:
//       return factory.updateTypeLiteralNode((<ts.TypeLiteralNode>node),
//         nodesVisitor((<ts.TypeLiteralNode>node).members, visitor, isTypeElement));
//
//     case ts.SyntaxKind.ArrayType:
//       return factory.updateArrayTypeNode(<ts.ArrayTypeNode>node,
//         nodeVisitor((<ts.ArrayTypeNode>node).elementType, visitor, isTypeNode));
//
//     case ts.SyntaxKind.TupleType:
//       return factory.updateTupleTypeNode((<ts.TupleTypeNode>node),
//         nodesVisitor((<ts.TupleTypeNode>node).elements, visitor, isTypeNode));
//
//     case ts.SyntaxKind.OptionalType:
//       return factory.updateOptionalTypeNode((<ts.OptionalTypeNode>node),
//         nodeVisitor((<ts.OptionalTypeNode>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.RestType:
//       return factory.updateRestTypeNode((<ts.RestTypeNode>node),
//         nodeVisitor((<ts.RestTypeNode>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.UnionType:
//       return factory.updateUnionTypeNode(<ts.UnionTypeNode>node,
//         nodesVisitor((<ts.UnionTypeNode>node).types, visitor, isTypeNode));
//
//     case ts.SyntaxKind.IntersectionType:
//       return factory.updateIntersectionTypeNode(<ts.IntersectionTypeNode>node,
//         nodesVisitor((<ts.IntersectionTypeNode>node).types, visitor, isTypeNode));
//
//     case ts.SyntaxKind.ConditionalType:
//       return factory.updateConditionalTypeNode(<ts.ConditionalTypeNode>node,
//         nodeVisitor((<ts.ConditionalTypeNode>node).checkType, visitor, isTypeNode),
//         nodeVisitor((<ts.ConditionalTypeNode>node).extendsType, visitor, isTypeNode),
//         nodeVisitor((<ts.ConditionalTypeNode>node).trueType, visitor, isTypeNode),
//         nodeVisitor((<ts.ConditionalTypeNode>node).falseType, visitor, isTypeNode));
//
//     case ts.SyntaxKind.InferType:
//       return factory.updateInferTypeNode(<ts.InferTypeNode>node,
//         nodeVisitor((<ts.InferTypeNode>node).typeParameter, visitor, isTypeParameterDeclaration));
//
//     case ts.SyntaxKind.ImportType:
//       return factory.updateImportTypeNode(<ts.ImportTypeNode>node,
//         nodeVisitor((<ts.ImportTypeNode>node).argument, visitor, isTypeNode),
//         nodeVisitor((<ts.ImportTypeNode>node).qualifier, visitor, isEntityName),
//         visitNodes((<ts.ImportTypeNode>node).typeArguments, visitor, isTypeNode),
//         (<ts.ImportTypeNode>node).isTypeOf
//       );
//
//     case ts.SyntaxKind.NamedTupleMember:
//       return factory.updateNamedTupleMember(<ts.NamedTupleMember>node,
//         visitNode((<ts.NamedTupleMember>node).dotDotDotToken, visitor, isToken),
//         visitNode((<ts.NamedTupleMember>node).name, visitor, isIdentifier),
//         visitNode((<ts.NamedTupleMember>node).questionToken, visitor, isToken),
//         visitNode((<ts.NamedTupleMember>node).type, visitor, isTypeNode),
//       );
//
//     case ts.SyntaxKind.ParenthesizedType:
//       return factory.updateParenthesizedType(<ts.ParenthesizedTypeNode>node,
//         nodeVisitor((<ts.ParenthesizedTypeNode>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.TypeOperator:
//       return factory.updateTypeOperatorNode(<ts.TypeOperatorNode>node,
//         nodeVisitor((<ts.TypeOperatorNode>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.IndexedAccessType:
//       return factory.updateIndexedAccessTypeNode((<ts.IndexedAccessTypeNode>node),
//         nodeVisitor((<ts.IndexedAccessTypeNode>node).objectType, visitor, isTypeNode),
//         nodeVisitor((<ts.IndexedAccessTypeNode>node).indexType, visitor, isTypeNode));
//
//     case ts.SyntaxKind.MappedType:
//       return factory.updateMappedTypeNode((<ts.MappedTypeNode>node),
//         nodeVisitor((<ts.MappedTypeNode>node).readonlyToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.MappedTypeNode>node).typeParameter, visitor, isTypeParameterDeclaration),
//         nodeVisitor((<ts.MappedTypeNode>node).nameType, visitor, isTypeNode),
//         nodeVisitor((<ts.MappedTypeNode>node).questionToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.MappedTypeNode>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.LiteralType:
//       return factory.updateLiteralTypeNode(<ts.LiteralTypeNode>node,
//         nodeVisitor((<ts.LiteralTypeNode>node).literal, visitor, isExpression));
//
//     case ts.SyntaxKind.TemplateLiteralType:
//       return factory.updateTemplateLiteralType(<ts.TemplateLiteralTypeNode>node,
//         nodeVisitor((<ts.TemplateLiteralTypeNode>node).head, visitor, isTemplateHead),
//         nodesVisitor((<ts.TemplateLiteralTypeNode>node).templateSpans, visitor, isTemplateLiteralTypeSpan));
//
//     case ts.SyntaxKind.TemplateLiteralTypeSpan:
//       return factory.updateTemplateLiteralTypeSpan(<ts.TemplateLiteralTypeSpan>node,
//         nodeVisitor((<ts.TemplateLiteralTypeSpan>node).type, visitor, isTypeNode),
//         nodeVisitor((<ts.TemplateLiteralTypeSpan>node).literal, visitor, isTemplateMiddleOrTemplateTail));
//
//     // Binding patterns
//     case ts.SyntaxKind.ObjectBindingPattern:
//       return factory.updateObjectBindingPattern(<ts.ObjectBindingPattern>node,
//         nodesVisitor((<ts.ObjectBindingPattern>node).elements, visitor, isBindingElement));
//
//     case ts.SyntaxKind.ArrayBindingPattern:
//       return factory.updateArrayBindingPattern(<ts.ArrayBindingPattern>node,
//         nodesVisitor((<ts.ArrayBindingPattern>node).elements, visitor, isArrayBindingElement));
//
//     case ts.SyntaxKind.BindingElement:
//       return factory.updateBindingElement(<ts.BindingElement>node,
//         nodeVisitor((<ts.BindingElement>node).dotDotDotToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.BindingElement>node).propertyName, visitor, isPropertyName),
//         nodeVisitor((<ts.BindingElement>node).name, visitor, isBindingName),
//         nodeVisitor((<ts.BindingElement>node).initializer, visitor, isExpression));
//
//     // Expression
//     case ts.SyntaxKind.ArrayLiteralExpression:
//       return factory.updateArrayLiteralExpression(<ts.ArrayLiteralExpression>node,
//         nodesVisitor((<ts.ArrayLiteralExpression>node).elements, visitor, isExpression));
//
//     case ts.SyntaxKind.ObjectLiteralExpression:
//       return factory.updateObjectLiteralExpression(<ts.ObjectLiteralExpression>node,
//         nodesVisitor((<ts.ObjectLiteralExpression>node).properties, visitor, isObjectLiteralElementLike));
//
//     case ts.SyntaxKind.PropertyAccessExpression:
//       if (node.flags & NodeFlags.OptionalChain) {
//         return factory.updatePropertyAccessChain(<ts.PropertyAccessChain>node,
//           nodeVisitor((<ts.PropertyAccessChain>node).expression, visitor, isExpression),
//           nodeVisitor((<ts.PropertyAccessChain>node).questionDotToken, tokenVisitor, isToken),
//           nodeVisitor((<ts.PropertyAccessChain>node).name, visitor, isIdentifier));
//       }
//       return factory.updatePropertyAccessExpression(<ts.PropertyAccessExpression>node,
//         nodeVisitor((<ts.PropertyAccessExpression>node).expression, visitor, isExpression),
//         nodeVisitor((<ts.PropertyAccessExpression>node).name, visitor, isIdentifierOrPrivateIdentifier));
//
//     case ts.SyntaxKind.ElementAccessExpression:
//       if (node.flags & NodeFlags.OptionalChain) {
//         return factory.updateElementAccessChain(<ts.ElementAccessChain>node,
//           nodeVisitor((<ts.ElementAccessChain>node).expression, visitor, isExpression),
//           nodeVisitor((<ts.ElementAccessChain>node).questionDotToken, tokenVisitor, isToken),
//           nodeVisitor((<ts.ElementAccessChain>node).argumentExpression, visitor, isExpression));
//       }
//       return factory.updateElementAccessExpression(<ts.ElementAccessExpression>node,
//         nodeVisitor((<ts.ElementAccessExpression>node).expression, visitor, isExpression),
//         nodeVisitor((<ts.ElementAccessExpression>node).argumentExpression, visitor, isExpression));
//
//     case ts.SyntaxKind.CallExpression:
//       if (node.flags & NodeFlags.OptionalChain) {
//         return factory.updateCallChain(<ts.CallChain>node,
//           nodeVisitor((<ts.CallChain>node).expression, visitor, isExpression),
//           nodeVisitor((<ts.CallChain>node).questionDotToken, tokenVisitor, isToken),
//           nodesVisitor((<ts.CallChain>node).typeArguments, visitor, isTypeNode),
//           nodesVisitor((<ts.CallChain>node).arguments, visitor, isExpression));
//       }
//       return factory.updateCallExpression(<ts.CallExpression>node,
//         nodeVisitor((<ts.CallExpression>node).expression, visitor, isExpression),
//         nodesVisitor((<ts.CallExpression>node).typeArguments, visitor, isTypeNode),
//         nodesVisitor((<ts.CallExpression>node).arguments, visitor, isExpression));
//
//     case ts.SyntaxKind.NewExpression:
//       return factory.updateNewExpression(<ts.NewExpression>node,
//         nodeVisitor((<ts.NewExpression>node).expression, visitor, isExpression),
//         nodesVisitor((<ts.NewExpression>node).typeArguments, visitor, isTypeNode),
//         nodesVisitor((<ts.NewExpression>node).arguments, visitor, isExpression));
//
//     case ts.SyntaxKind.TaggedTemplateExpression:
//       return factory.updateTaggedTemplateExpression(<ts.TaggedTemplateExpression>node,
//         nodeVisitor((<ts.TaggedTemplateExpression>node).tag, visitor, isExpression),
//         visitNodes((<ts.TaggedTemplateExpression>node).typeArguments, visitor, isExpression),
//         nodeVisitor((<ts.TaggedTemplateExpression>node).template, visitor, isTemplateLiteral));
//
//     case ts.SyntaxKind.TypeAssertionExpression:
//       return factory.updateTypeAssertion(<ts.TypeAssertion>node,
//         nodeVisitor((<ts.TypeAssertion>node).type, visitor, isTypeNode),
//         nodeVisitor((<ts.TypeAssertion>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.ParenthesizedExpression:
//       return factory.updateParenthesizedExpression(<ts.ParenthesizedExpression>node,
//         nodeVisitor((<ts.ParenthesizedExpression>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.FunctionExpression:
//       return factory.updateFunctionExpression(<ts.FunctionExpression>node,
//         nodesVisitor((<ts.FunctionExpression>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.FunctionExpression>node).asteriskToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.FunctionExpression>node).name, visitor, isIdentifier),
//         nodesVisitor((<ts.FunctionExpression>node).typeParameters, visitor, isTypeParameterDeclaration),
//         visitParameterList((<ts.FunctionExpression>node).parameters, visitor, context, nodesVisitor),
//         nodeVisitor((<ts.FunctionExpression>node).type, visitor, isTypeNode),
//         visitFunctionBody((<ts.FunctionExpression>node).body, visitor, context, nodeVisitor));
//
//     case ts.SyntaxKind.ArrowFunction:
//       return factory.updateArrowFunction(<ts.ArrowFunction>node,
//         nodesVisitor((<ts.ArrowFunction>node).modifiers, visitor, isModifier),
//         nodesVisitor((<ts.ArrowFunction>node).typeParameters, visitor, isTypeParameterDeclaration),
//         visitParameterList((<ts.ArrowFunction>node).parameters, visitor, context, nodesVisitor),
//         nodeVisitor((<ts.ArrowFunction>node).type, visitor, isTypeNode),
//         nodeVisitor((<ts.ArrowFunction>node).equalsGreaterThanToken, tokenVisitor, isToken),
//         visitFunctionBody((<ts.ArrowFunction>node).body, visitor, context, nodeVisitor));
//
//     case ts.SyntaxKind.DeleteExpression:
//       return factory.updateDeleteExpression(<ts.DeleteExpression>node,
//         nodeVisitor((<ts.DeleteExpression>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.TypeOfExpression:
//       return factory.updateTypeOfExpression(<ts.TypeOfExpression>node,
//         nodeVisitor((<ts.TypeOfExpression>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.VoidExpression:
//       return factory.updateVoidExpression(<ts.VoidExpression>node,
//         nodeVisitor((<ts.VoidExpression>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.AwaitExpression:
//       return factory.updateAwaitExpression(<ts.AwaitExpression>node,
//         nodeVisitor((<ts.AwaitExpression>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.PrefixUnaryExpression:
//       return factory.updatePrefixUnaryExpression(<ts.PrefixUnaryExpression>node,
//         nodeVisitor((<ts.PrefixUnaryExpression>node).operand, visitor, isExpression));
//
//     case ts.SyntaxKind.PostfixUnaryExpression:
//       return factory.updatePostfixUnaryExpression(<ts.PostfixUnaryExpression>node,
//         nodeVisitor((<ts.PostfixUnaryExpression>node).operand, visitor, isExpression));
//
//     case ts.SyntaxKind.BinaryExpression:
//       return factory.updateBinaryExpression(<ts.BinaryExpression>node,
//         nodeVisitor((<ts.BinaryExpression>node).left, visitor, isExpression),
//         nodeVisitor((<ts.BinaryExpression>node).operatorToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.BinaryExpression>node).right, visitor, isExpression));
//
//     case ts.SyntaxKind.ConditionalExpression:
//       return factory.updateConditionalExpression(<ts.ConditionalExpression>node,
//         nodeVisitor((<ts.ConditionalExpression>node).condition, visitor, isExpression),
//         nodeVisitor((<ts.ConditionalExpression>node).questionToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.ConditionalExpression>node).whenTrue, visitor, isExpression),
//         nodeVisitor((<ts.ConditionalExpression>node).colonToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.ConditionalExpression>node).whenFalse, visitor, isExpression));
//
//     case ts.SyntaxKind.TemplateExpression:
//       return factory.updateTemplateExpression(<ts.TemplateExpression>node,
//         nodeVisitor((<ts.TemplateExpression>node).head, visitor, isTemplateHead),
//         nodesVisitor((<ts.TemplateExpression>node).templateSpans, visitor, isTemplateSpan));
//
//     case ts.SyntaxKind.YieldExpression:
//       return factory.updateYieldExpression(<ts.YieldExpression>node,
//         nodeVisitor((<ts.YieldExpression>node).asteriskToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.YieldExpression>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.SpreadElement:
//       return factory.updateSpreadElement(<ts.SpreadElement>node,
//         nodeVisitor((<ts.SpreadElement>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.ClassExpression:
//       return factory.updateClassExpression(<ts.ClassExpression>node,
//         nodesVisitor((<ts.ClassExpression>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.ClassExpression>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.ClassExpression>node).name, visitor, isIdentifier),
//         nodesVisitor((<ts.ClassExpression>node).typeParameters, visitor, isTypeParameterDeclaration),
//         nodesVisitor((<ts.ClassExpression>node).heritageClauses, visitor, isHeritageClause),
//         nodesVisitor((<ts.ClassExpression>node).members, visitor, isClassElement));
//
//     case ts.SyntaxKind.ExpressionWithTypeArguments:
//       return factory.updateExpressionWithTypeArguments(<ts.ExpressionWithTypeArguments>node,
//         nodeVisitor((<ts.ExpressionWithTypeArguments>node).expression, visitor, isExpression),
//         nodesVisitor((<ts.ExpressionWithTypeArguments>node).typeArguments, visitor, isTypeNode));
//
//     case ts.SyntaxKind.AsExpression:
//       return factory.updateAsExpression(<ts.AsExpression>node,
//         nodeVisitor((<ts.AsExpression>node).expression, visitor, isExpression),
//         nodeVisitor((<ts.AsExpression>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.NonNullExpression:
//       if (node.flags & NodeFlags.OptionalChain) {
//         return factory.updateNonNullChain(<ts.NonNullChain>node,
//           nodeVisitor((<ts.NonNullChain>node).expression, visitor, isExpression));
//       }
//       return factory.updateNonNullExpression(<ts.NonNullExpression>node,
//         nodeVisitor((<ts.NonNullExpression>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.MetaProperty:
//       return factory.updateMetaProperty(<ts.MetaProperty>node,
//         nodeVisitor((<ts.MetaProperty>node).name, visitor, isIdentifier));
//
//     // Misc
//     case ts.SyntaxKind.TemplateSpan:
//       return factory.updateTemplateSpan(<ts.TemplateSpan>node,
//         nodeVisitor((<ts.TemplateSpan>node).expression, visitor, isExpression),
//         nodeVisitor((<ts.TemplateSpan>node).literal, visitor, isTemplateMiddleOrTemplateTail));
//
//     // Element
//     case ts.SyntaxKind.Block:
//       return factory.updateBlock(<ts.Block>node,
//         nodesVisitor((<ts.Block>node).statements, visitor, isStatement));
//
//     case ts.SyntaxKind.VariableStatement:
//       return factory.updateVariableStatement(<ts.VariableStatement>node,
//         nodesVisitor((<ts.VariableStatement>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.VariableStatement>node).declarationList, visitor, isVariableDeclarationList));
//
//     case ts.SyntaxKind.ExpressionStatement:
//       return factory.updateExpressionStatement(<ts.ExpressionStatement>node,
//         nodeVisitor((<ts.ExpressionStatement>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.IfStatement:
//       return factory.updateIfStatement(<ts.IfStatement>node,
//         nodeVisitor((<ts.IfStatement>node).expression, visitor, isExpression),
//         nodeVisitor((<ts.IfStatement>node).thenStatement, visitor, isStatement, factory.liftToBlock),
//         nodeVisitor((<ts.IfStatement>node).elseStatement, visitor, isStatement, factory.liftToBlock));
//
//     case ts.SyntaxKind.DoStatement:
//       return factory.updateDoStatement(<ts.DoStatement>node,
//         nodeVisitor((<ts.DoStatement>node).statement, visitor, isStatement, factory.liftToBlock),
//         nodeVisitor((<ts.DoStatement>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.WhileStatement:
//       return factory.updateWhileStatement(<ts.WhileStatement>node,
//         nodeVisitor((<ts.WhileStatement>node).expression, visitor, isExpression),
//         nodeVisitor((<ts.WhileStatement>node).statement, visitor, isStatement, factory.liftToBlock));
//
//     case ts.SyntaxKind.ForStatement:
//       return factory.updateForStatement(<ts.ForStatement>node,
//         nodeVisitor((<ts.ForStatement>node).initializer, visitor, isForInitializer),
//         nodeVisitor((<ts.ForStatement>node).condition, visitor, isExpression),
//         nodeVisitor((<ts.ForStatement>node).incrementor, visitor, isExpression),
//         nodeVisitor((<ts.ForStatement>node).statement, visitor, isStatement, factory.liftToBlock));
//
//     case ts.SyntaxKind.ForInStatement:
//       return factory.updateForInStatement(<ts.ForInStatement>node,
//         nodeVisitor((<ts.ForInStatement>node).initializer, visitor, isForInitializer),
//         nodeVisitor((<ts.ForInStatement>node).expression, visitor, isExpression),
//         nodeVisitor((<ts.ForInStatement>node).statement, visitor, isStatement, factory.liftToBlock));
//
//     case ts.SyntaxKind.ForOfStatement:
//       return factory.updateForOfStatement(<ts.ForOfStatement>node,
//         nodeVisitor((<ts.ForOfStatement>node).awaitModifier, tokenVisitor, isToken),
//         nodeVisitor((<ts.ForOfStatement>node).initializer, visitor, isForInitializer),
//         nodeVisitor((<ts.ForOfStatement>node).expression, visitor, isExpression),
//         nodeVisitor((<ts.ForOfStatement>node).statement, visitor, isStatement, factory.liftToBlock));
//
//     case ts.SyntaxKind.ContinueStatement:
//       return factory.updateContinueStatement(<ts.ContinueStatement>node,
//         nodeVisitor((<ts.ContinueStatement>node).label, visitor, isIdentifier));
//
//     case ts.SyntaxKind.BreakStatement:
//       return factory.updateBreakStatement(<ts.BreakStatement>node,
//         nodeVisitor((<ts.BreakStatement>node).label, visitor, isIdentifier));
//
//     case ts.SyntaxKind.ReturnStatement:
//       return factory.updateReturnStatement(<ts.ReturnStatement>node,
//         nodeVisitor((<ts.ReturnStatement>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.WithStatement:
//       return factory.updateWithStatement(<ts.WithStatement>node,
//         nodeVisitor((<ts.WithStatement>node).expression, visitor, isExpression),
//         nodeVisitor((<ts.WithStatement>node).statement, visitor, isStatement, factory.liftToBlock));
//
//     case ts.SyntaxKind.SwitchStatement:
//       return factory.updateSwitchStatement(<ts.SwitchStatement>node,
//         nodeVisitor((<ts.SwitchStatement>node).expression, visitor, isExpression),
//         nodeVisitor((<ts.SwitchStatement>node).caseBlock, visitor, isCaseBlock));
//
//     case ts.SyntaxKind.LabeledStatement:
//       return factory.updateLabeledStatement(<ts.LabeledStatement>node,
//         nodeVisitor((<ts.LabeledStatement>node).label, visitor, isIdentifier),
//         nodeVisitor((<ts.LabeledStatement>node).statement, visitor, isStatement, factory.liftToBlock));
//
//     case ts.SyntaxKind.ThrowStatement:
//       return factory.updateThrowStatement(<ts.ThrowStatement>node,
//         nodeVisitor((<ts.ThrowStatement>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.TryStatement:
//       return factory.updateTryStatement(<ts.TryStatement>node,
//         nodeVisitor((<ts.TryStatement>node).tryBlock, visitor, isBlock),
//         nodeVisitor((<ts.TryStatement>node).catchClause, visitor, isCatchClause),
//         nodeVisitor((<ts.TryStatement>node).finallyBlock, visitor, isBlock));
//
//     case ts.SyntaxKind.VariableDeclaration:
//       return factory.updateVariableDeclaration(<ts.VariableDeclaration>node,
//         nodeVisitor((<ts.VariableDeclaration>node).name, visitor, isBindingName),
//         nodeVisitor((<ts.VariableDeclaration>node).exclamationToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.VariableDeclaration>node).type, visitor, isTypeNode),
//         nodeVisitor((<ts.VariableDeclaration>node).initializer, visitor, isExpression));
//
//     case ts.SyntaxKind.VariableDeclarationList:
//       return factory.updateVariableDeclarationList(<ts.VariableDeclarationList>node,
//         nodesVisitor((<ts.VariableDeclarationList>node).declarations, visitor, isVariableDeclaration));
//
//     case ts.SyntaxKind.FunctionDeclaration:
//       return factory.updateFunctionDeclaration(<ts.FunctionDeclaration>node,
//         nodesVisitor((<ts.FunctionDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.FunctionDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.FunctionDeclaration>node).asteriskToken, tokenVisitor, isToken),
//         nodeVisitor((<ts.FunctionDeclaration>node).name, visitor, isIdentifier),
//         nodesVisitor((<ts.FunctionDeclaration>node).typeParameters, visitor, isTypeParameterDeclaration),
//         visitParameterList((<ts.FunctionDeclaration>node).parameters, visitor, context, nodesVisitor),
//         nodeVisitor((<ts.FunctionDeclaration>node).type, visitor, isTypeNode),
//         visitFunctionBody((<ts.FunctionExpression>node).body, visitor, context, nodeVisitor));
//
//     case ts.SyntaxKind.ClassDeclaration:
//       return factory.updateClassDeclaration(<ts.ClassDeclaration>node,
//         nodesVisitor((<ts.ClassDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.ClassDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.ClassDeclaration>node).name, visitor, isIdentifier),
//         nodesVisitor((<ts.ClassDeclaration>node).typeParameters, visitor, isTypeParameterDeclaration),
//         nodesVisitor((<ts.ClassDeclaration>node).heritageClauses, visitor, isHeritageClause),
//         nodesVisitor((<ts.ClassDeclaration>node).members, visitor, isClassElement));
//
//     case ts.SyntaxKind.InterfaceDeclaration:
//       return factory.updateInterfaceDeclaration(<ts.InterfaceDeclaration>node,
//         nodesVisitor((<ts.InterfaceDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.InterfaceDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.InterfaceDeclaration>node).name, visitor, isIdentifier),
//         nodesVisitor((<ts.InterfaceDeclaration>node).typeParameters, visitor, isTypeParameterDeclaration),
//         nodesVisitor((<ts.InterfaceDeclaration>node).heritageClauses, visitor, isHeritageClause),
//         nodesVisitor((<ts.InterfaceDeclaration>node).members, visitor, isTypeElement));
//
//     case ts.SyntaxKind.TypeAliasDeclaration:
//       return factory.updateTypeAliasDeclaration(<ts.TypeAliasDeclaration>node,
//         nodesVisitor((<ts.TypeAliasDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.TypeAliasDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.TypeAliasDeclaration>node).name, visitor, isIdentifier),
//         nodesVisitor((<ts.TypeAliasDeclaration>node).typeParameters, visitor, isTypeParameterDeclaration),
//         nodeVisitor((<ts.TypeAliasDeclaration>node).type, visitor, isTypeNode));
//
//     case ts.SyntaxKind.EnumDeclaration:
//       return factory.updateEnumDeclaration(<ts.EnumDeclaration>node,
//         nodesVisitor((<ts.EnumDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.EnumDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.EnumDeclaration>node).name, visitor, isIdentifier),
//         nodesVisitor((<ts.EnumDeclaration>node).members, visitor, isEnumMember));
//
//     case ts.SyntaxKind.ModuleDeclaration:
//       return factory.updateModuleDeclaration(<ts.ModuleDeclaration>node,
//         nodesVisitor((<ts.ModuleDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.ModuleDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.ModuleDeclaration>node).name, visitor, isIdentifier),
//         nodeVisitor((<ts.ModuleDeclaration>node).body, visitor, isModuleBody));
//
//     case ts.SyntaxKind.ModuleBlock:
//       return factory.updateModuleBlock(<ts.ModuleBlock>node,
//         nodesVisitor((<ts.ModuleBlock>node).statements, visitor, isStatement));
//
//     case ts.SyntaxKind.CaseBlock:
//       return factory.updateCaseBlock(<ts.CaseBlock>node,
//         nodesVisitor((<ts.CaseBlock>node).clauses, visitor, isCaseOrDefaultClause));
//
//     case ts.SyntaxKind.NamespaceExportDeclaration:
//       return factory.updateNamespaceExportDeclaration(<ts.NamespaceExportDeclaration>node,
//         nodeVisitor((<ts.NamespaceExportDeclaration>node).name, visitor, isIdentifier));
//
//     case ts.SyntaxKind.ImportEqualsDeclaration:
//       return factory.updateImportEqualsDeclaration(<ts.ImportEqualsDeclaration>node,
//         nodesVisitor((<ts.ImportEqualsDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.ImportEqualsDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.ImportEqualsDeclaration>node).name, visitor, isIdentifier),
//         nodeVisitor((<ts.ImportEqualsDeclaration>node).moduleReference, visitor, isModuleReference));
//
//     case ts.SyntaxKind.ImportDeclaration:
//       return factory.updateImportDeclaration(<ts.ImportDeclaration>node,
//         nodesVisitor((<ts.ImportDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.ImportDeclaration>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.ImportDeclaration>node).importClause, visitor, isImportClause),
//         nodeVisitor((<ts.ImportDeclaration>node).moduleSpecifier, visitor, isExpression));
//
//     case ts.SyntaxKind.ImportClause:
//       return factory.updateImportClause(<ts.ImportClause>node,
//         (node as ImportClause).isTypeOnly,
//         nodeVisitor((<ts.ImportClause>node).name, visitor, isIdentifier),
//         nodeVisitor((<ts.ImportClause>node).namedBindings, visitor, isNamedImportBindings));
//
//     case ts.SyntaxKind.NamespaceImport:
//       return factory.updateNamespaceImport(<ts.NamespaceImport>node,
//         nodeVisitor((<ts.NamespaceImport>node).name, visitor, isIdentifier));
//
//     case ts.SyntaxKind.NamespaceExport:
//       return factory.updateNamespaceExport(<ts.NamespaceExport>node,
//         nodeVisitor((<ts.NamespaceExport>node).name, visitor, isIdentifier));
//
//     case ts.SyntaxKind.NamedImports:
//       return factory.updateNamedImports(<ts.NamedImports>node,
//         nodesVisitor((<ts.NamedImports>node).elements, visitor, isImportSpecifier));
//
//     case ts.SyntaxKind.ImportSpecifier:
//       return factory.updateImportSpecifier(<ts.ImportSpecifier>node,
//         nodeVisitor((<ts.ImportSpecifier>node).propertyName, visitor, isIdentifier),
//         nodeVisitor((<ts.ImportSpecifier>node).name, visitor, isIdentifier));
//
//     case ts.SyntaxKind.ExportAssignment:
//       return factory.updateExportAssignment(<ts.ExportAssignment>node,
//         nodesVisitor((<ts.ExportAssignment>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.ExportAssignment>node).modifiers, visitor, isModifier),
//         nodeVisitor((<ts.ExportAssignment>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.ExportDeclaration:
//       return factory.updateExportDeclaration(<ts.ExportDeclaration>node,
//         nodesVisitor((<ts.ExportDeclaration>node).decorators, visitor, isDecorator),
//         nodesVisitor((<ts.ExportDeclaration>node).modifiers, visitor, isModifier),
//         (node as ExportDeclaration).isTypeOnly,
//         nodeVisitor((<ts.ExportDeclaration>node).exportClause, visitor, isNamedExportBindings),
//         nodeVisitor((<ts.ExportDeclaration>node).moduleSpecifier, visitor, isExpression));
//
//     case ts.SyntaxKind.NamedExports:
//       return factory.updateNamedExports(<ts.NamedExports>node,
//         nodesVisitor((<ts.NamedExports>node).elements, visitor, isExportSpecifier));
//
//     case ts.SyntaxKind.ExportSpecifier:
//       return factory.updateExportSpecifier(<ts.ExportSpecifier>node,
//         nodeVisitor((<ts.ExportSpecifier>node).propertyName, visitor, isIdentifier),
//         nodeVisitor((<ts.ExportSpecifier>node).name, visitor, isIdentifier));
//
//     // Module references
//     case ts.SyntaxKind.ExternalModuleReference:
//       return factory.updateExternalModuleReference(<ts.ExternalModuleReference>node,
//         nodeVisitor((<ts.ExternalModuleReference>node).expression, visitor, isExpression));
//
//     // JSX
//     case ts.SyntaxKind.JsxElement:
//       return factory.updateJsxElement(<ts.JsxElement>node,
//         nodeVisitor((<ts.JsxElement>node).openingElement, visitor, isJsxOpeningElement),
//         nodesVisitor((<ts.JsxElement>node).children, visitor, isJsxChild),
//         nodeVisitor((<ts.JsxElement>node).closingElement, visitor, isJsxClosingElement));
//
//     case ts.SyntaxKind.JsxSelfClosingElement:
//       return factory.updateJsxSelfClosingElement(<ts.JsxSelfClosingElement>node,
//         nodeVisitor((<ts.JsxSelfClosingElement>node).tagName, visitor, isJsxTagNameExpression),
//         nodesVisitor((<ts.JsxSelfClosingElement>node).typeArguments, visitor, isTypeNode),
//         nodeVisitor((<ts.JsxSelfClosingElement>node).attributes, visitor, isJsxAttributes));
//
//     case ts.SyntaxKind.JsxOpeningElement:
//       return factory.updateJsxOpeningElement(<ts.JsxOpeningElement>node,
//         nodeVisitor((<ts.JsxOpeningElement>node).tagName, visitor, isJsxTagNameExpression),
//         nodesVisitor((<ts.JsxSelfClosingElement>node).typeArguments, visitor, isTypeNode),
//         nodeVisitor((<ts.JsxOpeningElement>node).attributes, visitor, isJsxAttributes));
//
//     case ts.SyntaxKind.JsxClosingElement:
//       return factory.updateJsxClosingElement(<ts.JsxClosingElement>node,
//         nodeVisitor((<ts.JsxClosingElement>node).tagName, visitor, isJsxTagNameExpression));
//
//     case ts.SyntaxKind.JsxFragment:
//       return factory.updateJsxFragment(<ts.JsxFragment>node,
//         nodeVisitor((<ts.JsxFragment>node).openingFragment, visitor, isJsxOpeningFragment),
//         nodesVisitor((<ts.JsxFragment>node).children, visitor, isJsxChild),
//         nodeVisitor((<ts.JsxFragment>node).closingFragment, visitor, isJsxClosingFragment));
//
//     case ts.SyntaxKind.JsxAttribute:
//       return factory.updateJsxAttribute(<ts.JsxAttribute>node,
//         nodeVisitor((<ts.JsxAttribute>node).name, visitor, isIdentifier),
//         nodeVisitor((<ts.JsxAttribute>node).initializer, visitor, isStringLiteralOrJsxExpression));
//
//     case ts.SyntaxKind.JsxAttributes:
//       return factory.updateJsxAttributes(<ts.JsxAttributes>node,
//         nodesVisitor((<ts.JsxAttributes>node).properties, visitor, isJsxAttributeLike));
//
//     case ts.SyntaxKind.JsxSpreadAttribute:
//       return factory.updateJsxSpreadAttribute(<ts.JsxSpreadAttribute>node,
//         nodeVisitor((<ts.JsxSpreadAttribute>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.JsxExpression:
//       return factory.updateJsxExpression(<ts.JsxExpression>node,
//         nodeVisitor((<ts.JsxExpression>node).expression, visitor, isExpression));
//
//     // Clauses
//     case ts.SyntaxKind.CaseClause:
//       return factory.updateCaseClause(<ts.CaseClause>node,
//         nodeVisitor((<ts.CaseClause>node).expression, visitor, isExpression),
//         nodesVisitor((<ts.CaseClause>node).statements, visitor, isStatement));
//
//     case ts.SyntaxKind.DefaultClause:
//       return factory.updateDefaultClause(<ts.DefaultClause>node,
//         nodesVisitor((<ts.DefaultClause>node).statements, visitor, isStatement));
//
//     case ts.SyntaxKind.HeritageClause:
//       return factory.updateHeritageClause(<ts.HeritageClause>node,
//         nodesVisitor((<ts.HeritageClause>node).types, visitor, isExpressionWithTypeArguments));
//
//     case ts.SyntaxKind.CatchClause:
//       return factory.updateCatchClause(<ts.CatchClause>node,
//         nodeVisitor((<ts.CatchClause>node).variableDeclaration, visitor, isVariableDeclaration),
//         nodeVisitor((<ts.CatchClause>node).block, visitor, isBlock));
//
//     // Property assignments
//     case ts.SyntaxKind.PropertyAssignment:
//       return factory.updatePropertyAssignment(<ts.PropertyAssignment>node,
//         nodeVisitor((<ts.PropertyAssignment>node).name, visitor, isPropertyName),
//         nodeVisitor((<ts.PropertyAssignment>node).initializer, visitor, isExpression));
//
//     case ts.SyntaxKind.ShorthandPropertyAssignment:
//       return factory.updateShorthandPropertyAssignment(<ts.ShorthandPropertyAssignment>node,
//         nodeVisitor((<ts.ShorthandPropertyAssignment>node).name, visitor, isIdentifier),
//         nodeVisitor((<ts.ShorthandPropertyAssignment>node).objectAssignmentInitializer, visitor, isExpression));
//
//     case ts.SyntaxKind.SpreadAssignment:
//       return factory.updateSpreadAssignment(<ts.SpreadAssignment>node,
//         nodeVisitor((<ts.SpreadAssignment>node).expression, visitor, isExpression));
//
//     // Enum
//     case ts.SyntaxKind.EnumMember:
//       return factory.updateEnumMember(<ts.EnumMember>node,
//         nodeVisitor((<ts.EnumMember>node).name, visitor, isPropertyName),
//         nodeVisitor((<ts.EnumMember>node).initializer, visitor, isExpression));
//
//     // Top-level nodes
//     case ts.SyntaxKind.SourceFile:
//       return factory.updateSourceFile(<ts.SourceFile>node,
//         visitLexicalEnvironment((<ts.SourceFile>node).statements, visitor, context));
//
//     // Transformation nodes
//     case ts.SyntaxKind.PartiallyEmittedExpression:
//       return factory.updatePartiallyEmittedExpression(<ts.PartiallyEmittedExpression>node,
//         nodeVisitor((<ts.PartiallyEmittedExpression>node).expression, visitor, isExpression));
//
//     case ts.SyntaxKind.CommaListExpression:
//       return factory.updateCommaListExpression(<ts.CommaListExpression>node,
//         nodesVisitor((<ts.CommaListExpression>node).elements, visitor, isExpression));
//
//     default:
//       // No need to visit nodes with no children.
//       return node;
//   }
//
// }
