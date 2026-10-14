import type { ComponentType } from "react"
import type { Page } from "./routes"
import type { Article } from "./ArticleTypes"
import "./Articles.css"

type Props = {
  Header: ComponentType
  selectedArticle: Article | null
  setPage: (page: Page, articleSlug?: string) => void
  renderMarkdown: (markdown: string, slug: string) => string
}

export default function ArticlePage(props: Props) {
  const { Header, selectedArticle, setPage, renderMarkdown } = props
  if (!selectedArticle) return null

    return (
      <div className="app">
        <Header />
        <main className="article-page">
          <button className="article-back" onClick={() => setPage("articles")}>
            ← Back to Articles
          </button>

          <article className="article-content">
            <div className="article-meta">
              <span>{selectedArticle.category}</span> · {selectedArticle.date}
            </div>
            <h1>{selectedArticle.title}</h1>
            <p className="article-excerpt">{selectedArticle.excerpt}</p>
            {selectedArticle.image && (
              <img
                className="article-image"
                src={selectedArticle.image.startsWith("/") ? selectedArticle.image : `/articles/${selectedArticle.slug}/${selectedArticle.image}`}
                alt={selectedArticle.imageAlt || selectedArticle.title}
              />
            )}
            <div
              className="article-markdown"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(selectedArticle.content, selectedArticle.slug),
              }}
            />
          </article>
        </main>
      </div>
    )
}
