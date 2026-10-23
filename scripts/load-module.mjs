import { readFile } from "node:fs/promises"
import { resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"
const cache = new Map()
// The app's pure modules use local ESM imports; resolve their graph without a test framework.
export async function moduleUrl(path) {
  path = resolve(path instanceof URL ? fileURLToPath(path) : path)
  if (cache.has(path)) return cache.get(path)
  const source = await readFile(path, "utf8")
  const compiled = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  })
  const errors =
    compiled.diagnostics?.filter(
      (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
    ) ?? []
  if (errors.length)
    throw new Error(
      `${path}: ${errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")).join("\n")}`,
    )
  let js = compiled.outputText
  const imports = [...js.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)]
  for (const match of imports) {
    const specifier = match[1]
    if (!specifier.startsWith("."))
      throw new Error(`Unexpected non-local pure-module import: ${specifier}`)
    const url = await moduleUrl(
      resolve(
        dirname(path),
        specifier.endsWith(".ts") ? specifier : `${specifier}.ts`,
      ),
    )
    js = js.replace(match[0], match[0].replace(specifier, url))
  }
  const url = `data:text/javascript;base64,${Buffer.from(js).toString("base64")}`
  cache.set(path, url)
  return url
}
export async function loadModule(path) {
  return import(await moduleUrl(path))
}
