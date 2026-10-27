import ts from 'typescript';
export function routeContract(text) {
 const ast=ts.createSourceFile('routes.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const bindings={}; let routes,layout;
 const canonical=n=>{
  if(ts.isParenthesizedExpression(n)) return canonical(n.expression);
  if(ts.isJsxText(n)&&!n.text.trim()) return null;
  const children=[]; ts.forEachChild(n,c=>{const v=canonical(c); if(v!==null) children.push(v)});
  return [ts.SyntaxKind[n.kind], ...(children.length?[children]:[ts.isIdentifier(n)||ts.isStringLiteralLike(n)||ts.isNumericLiteral(n)?n.text:n.getText(ast).trim()])];
 };
 for(const statement of ast.statements){
  if(ts.isImportDeclaration(statement)){
   const clause=statement.importClause; if(!clause)continue;
   if(clause.name)bindings[clause.name.text]=[statement.moduleSpecifier.text,'default'];
   if(clause.namedBindings&&ts.isNamedImports(clause.namedBindings))for(const item of clause.namedBindings.elements)bindings[item.name.text]=[statement.moduleSpecifier.text,item.propertyName?.text??item.name.text];
  }
  if(ts.isFunctionDeclaration(statement)&&statement.name?.text==='MainLayout')layout=statement;
  if(ts.isVariableStatement(statement))for(const declaration of statement.declarationList.declarations){
   const init=declaration.initializer;
   if(init&&ts.isCallExpression(init)&&init.expression.getText(ast)==='createBrowserRouter')routes=init.arguments[0];
   if(init&&ts.isCallExpression(init)&&init.expression.getText(ast)==='deferredPage'){
    let module,exportName='default';
    const visit=n=>{if(ts.isCallExpression(n)&&n.expression.kind===ts.SyntaxKind.ImportKeyword)module=n.arguments[0].text;
     if(ts.isPropertyAssignment(n)&&n.name.getText(ast)==='default'&&ts.isPropertyAccessExpression(n.initializer))exportName=n.initializer.name.text;
     ts.forEachChild(n,visit)};visit(init);if(!module)throw Error('Missing lazy module');bindings[declaration.name.getText(ast)]=[module,exportName];
   }
  }
 }
 if(!routes||!layout)throw Error('Missing route tree/layout');
 const referenced=new Set(['createBrowserRouter']);const visit=n=>{if(ts.isIdentifier(n))referenced.add(n.text);ts.forEachChild(n,visit)};visit(routes);visit(layout);
 return {routes:canonical(routes),layout:canonical(layout),bindings:Object.fromEntries(Object.entries(bindings).filter(([k])=>referenced.has(k)).sort(([a],[b])=>a.localeCompare(b)))};
}
