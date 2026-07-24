import { access } from "node:fs/promises";
import path from "node:path";
import { diagnostic } from "./diagnostics.mjs";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ARXIV_ID = /^\d{4}\.\d{4,5}(v\d+)?$/;
const ROOT_TYPES = new Map([
  ["wiki/index.md", "meta"],
  ["wiki/log.md", "meta"],
  ["wiki/overview.md", "meta"],
]);
const DIR_TYPES = new Map([
  ["sources", "source"],
  ["concepts", "concept"],
  ["entities", "entity"],
  ["comparisons", "comparison"],
  ["meta", "meta"],
]);

function hasString(data, key) {
  return typeof data?.[key] === "string" && data[key].trim().length > 0;
}

function hasArray(data, key) {
  return Array.isArray(data?.[key]);
}

function addRequiredString(diagnostics, file, data, key) {
  if (!hasString(data, key)) {
    diagnostics.push(
      diagnostic("frontmatter-field", "error", file.relative, `Frontmatter field '${key}' must be a non-empty string.`, {
        key,
      }),
    );
  }
}

function addRequiredArray(diagnostics, file, data, key, severity = "error") {
  if (!hasArray(data, key)) {
    diagnostics.push(
      diagnostic("frontmatter-field", severity, file.relative, `Frontmatter field '${key}' must be an array.`, {
        key,
      }),
    );
  }
}

export async function validateSchema(root, file, parsed) {
  if (!parsed.data || typeof parsed.data !== "object") return [];
  const data = parsed.data;
  const diagnostics = [];

  for (const key of ["title", "type", "created", "updated"]) {
    addRequiredString(diagnostics, file, data, key);
  }
  addRequiredArray(diagnostics, file, data, "tags");

  if (hasString(data, "created") && !ISO_DATE.test(data.created)) {
    diagnostics.push(diagnostic("frontmatter-date", "error", file.relative, "'created' must use YYYY-MM-DD.", { key: "created" }));
  }
  if (hasString(data, "updated") && !ISO_DATE.test(data.updated)) {
    diagnostics.push(diagnostic("frontmatter-date", "error", file.relative, "'updated' must use YYYY-MM-DD.", { key: "updated" }));
  }
  if (hasString(data, "created") && hasString(data, "updated") && data.updated < data.created) {
    diagnostics.push(diagnostic("frontmatter-date-order", "error", file.relative, "'updated' cannot be earlier than 'created'.", { key: "order" }));
  }

  const expectedType = ROOT_TYPES.get(file.relative) ?? DIR_TYPES.get(file.directory);
  if (expectedType && data.type !== expectedType) {
    diagnostics.push(
      diagnostic("page-type", "error", file.relative, `Expected type '${expectedType}' for this path, found '${data.type ?? "missing"}'.`, {
        key: expectedType,
      }),
    );
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(file.stem)) {
    diagnostics.push(diagnostic("filename", "error", file.relative, "Wiki filenames must use kebab-case.", { key: file.stem }));
  }

  if (!file.isRootPage) addRequiredArray(diagnostics, file, data, "aliases");

  if (["concepts", "entities", "comparisons", "meta"].includes(file.directory)) {
    addRequiredArray(diagnostics, file, data, "sources");
  }

  if (file.directory === "sources") {
    addRequiredArray(diagnostics, file, data, "authors");
    if (!Number.isInteger(data.year)) {
      diagnostics.push(diagnostic("frontmatter-field", "error", file.relative, "Frontmatter field 'year' must be an integer.", { key: "year" }));
    }
    if (!hasString(data, "venue")) {
      diagnostics.push(diagnostic("source-venue", "warning", file.relative, "Source page has no non-empty venue metadata.", { key: "venue" }));
    }
    if (data.arxiv_id !== undefined && (typeof data.arxiv_id !== "string" || !ARXIV_ID.test(data.arxiv_id))) {
      diagnostics.push(diagnostic("arxiv-id", "error", file.relative, "'arxiv_id' must look like 1234.56789 with an optional version suffix.", { key: "arxiv_id" }));
    }
    if (typeof data.pdf_path === "string" && data.pdf_path.trim() === "") {
      diagnostics.push(diagnostic("empty-optional-field", "warning", file.relative, "Remove empty 'pdf_path' instead of storing an empty string.", { key: "pdf_path" }));
    }
    for (const key of ["code_url", "project_url"]) {
      if (typeof data[key] === "string" && data[key].trim() === "") {
        diagnostics.push(diagnostic("empty-optional-field", "warning", file.relative, `Remove empty '${key}' instead of storing an empty string.`, { key }));
      }
    }
    if (typeof data.pdf_path === "string" && /^https?:\/\/arxiv\.org\/pdf\//.test(data.pdf_path) && !hasString(data, "arxiv_id")) {
      diagnostics.push(diagnostic("arxiv-id-missing", "error", file.relative, "An arXiv PDF URL requires matching 'arxiv_id' metadata.", { key: "arxiv-url" }));
    }
    if (typeof data.pdf_path === "string" && data.pdf_path.startsWith("raw/")) {
      try {
        await access(path.join(root, data.pdf_path));
      } catch {
        diagnostics.push(
          diagnostic("local-pdf", "error", file.relative, `Local PDF path does not exist: ${data.pdf_path}`, {
            key: data.pdf_path,
          }),
        );
      }
    }
  }

  return diagnostics;
}
