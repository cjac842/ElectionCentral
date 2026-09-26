# Election Central Markdown Articles

Articles are now written as Markdown files instead of TypeScript.

## Add a new article

Create a folder here:

`src/articles/your-article-name/`

Inside it, create:

`article.md`

Start the file with this front matter:

```text
---
title: Your Article Title
date: 2026-09-20
category: Analysis
excerpt: A short description shown on the Articles page.
image: my-image1.png
imageAlt: Description of the image
---
```

Then write the article normally underneath it. You can use Markdown headings, paragraphs, bold text, italics, bullet lists, links, and images.

Images used as the article's main image go here:

`public/articles/your-article-name/my-image1.png`

If you want another image inside the article, put it in the same public folder and use:

```markdown
![Image description](second-image.png)
```

The Articles page automatically discovers every `article.md` file, so you do not need to edit a master article list.
