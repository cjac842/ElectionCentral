import type { ComponentType, Dispatch, SetStateAction } from "react"
import type { Page } from "./routes"
import type { Article } from "./ArticleTypes"
import "./Articles.css"

type Props = {
  Header: ComponentType
  articles: Article[]
  setSelectedArticle: Dispatch<SetStateAction<Article | null>>
  setPage: (page: Page, articleSlug?: string) => void
}

export default function Articles(props: Props) {
  const { Header, articles, setSelectedArticle, setPage } = props

    return (
      <div className="app">
        <Header />
        <main className="articles-page">
          <div className="page-eyebrow">ELECTION CENTRAL ARTICLES</div>
          <h1>Articles</h1>
          <p>Election analysis, race coverage, and updates from Election Central.</p>

          <div className="article-list">
            {articles.length === 0 ? (
              <div className="articles-coming-soon">Coming Soon...</div>
            ) : (
              articles.map((article) => (
              <button
                key={article.slug}
                className="article-preview"
                onClick={() => {
                  setSelectedArticle(article)
                  setPage("article", article.slug)
                }}
              >
                <div className="article-preview-meta">
                  <span>{article.category}</span>
                  <span>{article.date}</span>
                </div>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
                <span className="article-preview-arrow">Read article →</span>
              </button>
              ))
            )}
          </div>
        </main>
      </div>
    )
}
