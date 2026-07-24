import { discoverWiki } from "./discover.mjs";
import { parseFrontmatter } from "./frontmatter.mjs";
import { sortDiagnostics } from "./diagnostics.mjs";
import { validateSchema } from "./schemas.mjs";
import { validateMarkdown } from "./markdown.mjs";
import { validateLinks } from "./links.mjs";
import { validateManifest } from "./manifest.mjs";

export async function validateWiki(root) {
  const files = await discoverWiki(root);
  const pages = files.map((file) => ({ file, parsed: parseFrontmatter(file) }));
  const diagnostics = pages.flatMap((page) => page.parsed.diagnostics);

  for (const page of pages) {
    diagnostics.push(...(await validateSchema(root, page.file, page.parsed)));
    diagnostics.push(...validateMarkdown(page.file, page.parsed));
  }

  diagnostics.push(...(await validateLinks(root, pages)));
  diagnostics.push(...(await validateManifest(root, pages)));

  return { pages, diagnostics: sortDiagnostics(diagnostics) };
}
