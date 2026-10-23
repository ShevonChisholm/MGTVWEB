import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import ts from "typescript"
import {
  snapshot,
  source,
  parse,
  literalDeclaration,
} from "./copy-snapshot.mjs"
import { loadModule } from "./load-module.mjs"

const baseline = JSON.parse(await source("scripts/fixtures/copy-baseline.json"))
assert.deepEqual(
  JSON.parse(JSON.stringify(await snapshot())),
  baseline,
  "Legal bodies, monetary inputs, catalog identities/relationships, filter values and behaviour must stay unchanged",
)

const site = JSON.parse(await source(".figma/make/site.json"))
assert.equal(site.title, "MGTV — Jamaican and Caribbean entertainment")
assert.equal(
  site.description,
  "Explore Jamaican and Caribbean series, films, music, sport, news and sample events in the MGTV customer web prototype.",
)
assert.equal(site.language, "en")
assert.equal(site.robots.index, false)

const visited = new Map()
async function visitFile(path) {
  if (visited.has(path)) return
  const text = await readFile(path, "utf8")
  const ast = parse(text, path)
  visited.set(path, ast)
  const imports = ast.statements.filter(ts.isImportDeclaration)
  for (const declaration of imports) {
    const specifier = declaration.moduleSpecifier.text
    const local = specifier.startsWith("@/")
      ? resolve("src", specifier.slice(2))
      : specifier.startsWith(".")
        ? resolve(dirname(path), specifier)
        : null
    if (!local || /\.\w+$/.test(local)) continue
    for (const extension of [".tsx", ".ts"]) {
      try {
        await readFile(local + extension)
      } catch {
        continue
      }
      await visitFile(local + extension)
      break
    }
  }
}
await visitFile(resolve("src/App.tsx"))
let links = 0
const labels = {
  "/shows": ["All shows", "Browse shows"],
  "/movies": ["All movies"],
  "/music": ["All videos"],
  "/music?view=artists": ["All artists"],
  "/music?view=tracks": ["All tracks"],
  "/music?view=playlists": ["All playlists"],
  "/sports": ["All sports"],
  "/events": ["All events"],
  "/news": ["All news"],
  "/lifestyle": ["All lifestyle stories"],
  "/my-list": ["My List"],
}
for (const [path, ast] of visited) {
  const walk = (node) => {
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      node.tagName.getText() === "ContentRail"
    ) {
      const attrs = new Map(
        node.attributes.properties
          .filter(ts.isJsxAttribute)
          .map((a) => [a.name.getText(), a.initializer]),
      )
      if (attrs.has("seeAllHref")) {
        links++
        assert(
          attrs.has("seeAllLabel"),
          `${path}: specific collection link required`,
        )
        const href = attrs.get("seeAllHref")
        const label = attrs.get("seeAllLabel")
        if (ts.isStringLiteral(href)) {
          assert(ts.isStringLiteral(label))
          assert(
            labels[href.text]?.includes(label.text),
            `${path}: misleading ${label.text} link to ${href.text}`,
          )
        }
      }
      assert(!attrs.has("ranked"), `${path}: no unsupported sample rankings`)
      if (/(Shows|Movies|Sports)Page\.tsx$/.test(path))
        assert.equal(attrs.get("layout")?.text, "contained")
    }
    if (ts.isJsxExpression(node)) {
      assert(
        !/\b(followerCount|getLikeCount|product\.reviewCount)\b/.test(
          node.getText(),
        ),
        `${path}: unsupported public aggregate`,
      )
    }
    ts.forEachChild(node, walk)
  }
  walk(ast)
  assert(
    !ast.text.includes(
      "Stories, sounds and standout moments. From Jamaica to the world.",
    ),
    `${path}: positioning is guidance, not interface copy`,
  )
}
assert(
  !JSON.stringify(site).includes(
    "Stories, sounds and standout moments. From Jamaica to the world.",
  ),
)
const data = await loadModule(
  new URL("../src/data/mockContent.ts", import.meta.url),
)
const editorial = [
  ...Object.values(data.allNewsArticles).flatMap((a) => [a.title, ...a.body]),
  ...Object.values(data.allArtistDetails).map((a) => a.bio),
  ...data.lifestyleArticles.flatMap((a) => [a.title, a.subtitle, a.excerpt]),
  ...data.products.map((p) => p.description),
].join("\n")
assert(
  !/\b(record-breaking|85,000|4\.2 million|1\.8 million|world-leading|went platinum|sold out|award-winning|nature's multivitamin)\b/i.test(
    editorial,
  ),
)
const content = literalDeclaration(
  await source("src/pages/StaticPage.tsx"),
  "content",
)
assert(!/@mgtv\.com|business days/.test(JSON.stringify(content["/contact"])))
for (const path of [
  "src/components/home/MGTVPlusBanner.tsx",
  "src/pages/HomePage.tsx",
]) {
  assert(
    !/Start Free Trial|Cancel anytime|Limitless culture|Trending Now"|Popular Movies"/.test(
      await source(path),
    ),
  )
}
const footer = await source("src/components/layout/Footer.tsx")
assert(footer.includes("Signup not connected"))
assert(footer.includes('htmlFor="newsletter-email"'))
assert(footer.includes('link.to === "#"') || footer.includes("link.to === '#'"))
assert(
  (await source("src/pages/StaticPage.tsx")).includes(
    "Draft policy — owner review required.",
  ),
)
console.log(
  `Copy checks passed: ${links} specific collection links; protected legal, pricing, state, filters, routes and relationships match the pre-edit baseline.`,
)
