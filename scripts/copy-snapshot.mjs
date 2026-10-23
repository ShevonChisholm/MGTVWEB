import { readFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import ts from "typescript"
import { loadModule } from "./load-module.mjs"

export async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8")
}

export function parse(text, path = "source.tsx") {
  return ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true)
}

export function literalDeclaration(text, name) {
  let initializer
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === name)
      initializer = node.initializer
    ts.forEachChild(node, visit)
  }
  visit(parse(text))
  if (!initializer) throw new Error(`Missing ${name}`)
  const js = ts.transpileModule(`const value = ${initializer.getText()}`, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  }).outputText
  return Function(`${js}; return value`)()
}

export async function snapshot() {
  const data = await loadModule(
    new URL("../src/data/mockContent.ts", import.meta.url),
  )
  const staticContent = literalDeclaration(
    await source("src/pages/StaticPage.tsx"),
    "content",
  )
  const plus = await source("src/pages/MGTVPlusPage.tsx")
  const protectedFiles = [
    "src/app/routes.tsx",
    "src/lib/appState.ts",
    "src/lib/accessPolicy.ts",
    "src/lib/playbackAccess.ts",
    "src/lib/playback.ts",
    "src/context/AppStateContext.tsx",
    "src/context/MediaPlaybackContext.tsx",
    "src/context/PlaylistContext.tsx",
    "src/context/InteractionContext.tsx",
    "src/components/shared/PurchaseDemo.tsx",
    "src/data/mockAccount.ts",
    "src/data/mockAwards.ts",
  ]
  return {
    policies: Object.fromEntries(
      ["/privacy", "/terms"].map((key) => [key, staticContent[key].body]),
    ),
    products: data.products.map(
      ({ id, price, originalPrice, inStock, rating, reviewCount }) => ({
        id,
        price,
        originalPrice,
        inStock,
        rating,
        reviewCount,
      }),
    ),
    plans: literalDeclaration(plus, "plans").map(({ badge, ...plan }) => plan),
    comparison: literalDeclaration(plus, "freeVsPremium"),
    catalog: data.catalog.map(({ description, title, readTime, ...item }) => ({
      ...item,
      ...(item.type !== "news" && readTime ? { readTime } : {}),
      ...(!["news", "lifestyle"].includes(item.type) ? { title } : {}),
      path: data.contentPath({ ...item, title }),
      watch: data.watchPath({ ...item, title }),
    })),
    playlists: data.playlists.map(({ description, ...playlist }) => playlist),
    events: Object.values(data.allEventDetails).map(
      ({ description, ...event }) => event,
    ),
    broadcasts: data.broadcasts,
    filters: Object.fromEntries(
      await Promise.all(
        [
          "shows",
          "movies",
          "videos",
          "tracks",
          "artists",
          "sports",
          "events",
          "news",
          "lifestyle",
          "search",
          "my-list",
        ].map(async (scope) => {
          const discovery = await loadModule(
            new URL("../src/lib/discovery.ts", import.meta.url),
          )
          return [
            scope,
            discovery
              .filterGroups(data.catalog, scope)
              .map(({ id, options }) => ({
                id,
                values: options.map(({ value }) => value),
              })),
          ]
        }),
      ),
    ),
    protectedFiles: Object.fromEntries(
      await Promise.all(
        protectedFiles.map(async (path) => [
          path,
          createHash("sha256")
            .update(await source(path))
            .digest("hex"),
        ]),
      ),
    ),
  }
}
