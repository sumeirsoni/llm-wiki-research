import { parseDocument } from "yaml";
import { diagnostic } from "./diagnostics.mjs";

export function parseFrontmatter(file) {
  const lines = file.content.split(/\r?\n/);
  const diagnostics = [];

  if (lines[0] !== "---") {
    diagnostics.push(
      diagnostic(
        "frontmatter-delimiter",
        "error",
        file.relative,
        "The file must start with a YAML frontmatter delimiter (---).",
        { line: 1, key: "missing-open" },
      ),
    );
    return { data: null, body: file.content, bodyLine: 1, diagnostics };
  }

  const closingIndex = lines.findIndex((line, index) => index > 0 && line === "---");
  if (closingIndex === -1) {
    diagnostics.push(
      diagnostic(
        "frontmatter-delimiter",
        "error",
        file.relative,
        "The YAML frontmatter block is not closed with a second --- delimiter.",
        { line: 1, key: "missing-close" },
      ),
    );
    return { data: null, body: "", bodyLine: lines.length + 1, diagnostics };
  }

  const yamlText = lines.slice(1, closingIndex).join("\n");
  const document = parseDocument(yamlText, {
    prettyErrors: false,
    uniqueKeys: true,
  });

  for (const error of document.errors) {
    diagnostics.push(
      diagnostic("frontmatter-yaml", "error", file.relative, error.message, {
        line: 2,
        key: error.code ?? error.message,
      }),
    );
  }

  let data = null;
  if (document.errors.length === 0) {
    try {
      data = document.toJS();
    } catch (error) {
      diagnostics.push(
        diagnostic("frontmatter-yaml", "error", file.relative, error.message, {
          line: 2,
          key: "to-js",
        }),
      );
    }
  }

  return {
    data,
    body: lines.slice(closingIndex + 1).join("\n"),
    bodyLine: closingIndex + 2,
    diagnostics,
  };
}
