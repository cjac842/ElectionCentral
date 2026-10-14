import type { Article } from "./ArticleTypes"

const articleModules = import.meta.glob("./articles/*/article.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

function parseArticle(markdown: string, path: string): Article {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  const frontMatter: Record<string, string> = {}
  const content = match ? match[2].trim() : markdown.trim()

  if (match) {
    match[1].split("\n").forEach((line) => {
      const separator = line.indexOf(":")
      if (separator === -1) return

      const key = line.slice(0, separator).trim()
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "")
      frontMatter[key] = value
    })
  }

  const slug = path.match(/\.\/articles\/([^/]+)\/article\.md$/)?.[1] ?? "article"

  return {
    slug,
    title: frontMatter.title || "Untitled Article",
    date: frontMatter.date || "",
    category: frontMatter.category || "Article",
    excerpt: frontMatter.excerpt || "",
    image: frontMatter.image || undefined,
    imageAlt: frontMatter.imageAlt || "",
    content,
  }
}

export const articles = Object.entries(articleModules)
  .map(([path, markdown]) => parseArticle(markdown, path))
  .sort((a, b) => b.date.localeCompare(a.date))

export function renderMarkdown(markdown: string, slug: string) {
  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")

  const inline = (value: string) => {
    let result = escapeHtml(value)

    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
      const imageSrc = src.startsWith("/") ? src : `/articles/${slug}/${src}`
      return `<img src="${imageSrc}" alt="${alt}" class="article-inline-image" />`
    })
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    result = result.replace(/__([^_]+)__/g, "<strong>$1</strong>")
    result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>")
    result = result.replace(/_([^_]+)_/g, "<em>$1</em>")

    return result
  }

  const lines = markdown.replace(/\r\n/g, "\n").split("\n")
  const output: string[] = []
  let paragraph: string[] = []
  let list: string[] = []

  const flushParagraph = () => {
    if (paragraph.length) {
      output.push(`<p>${inline(paragraph.join(" "))}</p>`)
      paragraph = []
    }
  }

  const flushList = () => {
    if (list.length) {
      output.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`)
      list = []
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()

    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      const level = heading[1].length
      output.push(`<h${level}>${inline(heading[2])}</h${level}>`)
      return
    }

    const listItem = trimmed.match(/^[-*]\s+(.+)$/)
    if (listItem) {
      flushParagraph()
      list.push(listItem[1])
      return
    }

    flushList()
    paragraph.push(trimmed)
  })

  flushParagraph()
  flushList()

  return output.join("")
}

