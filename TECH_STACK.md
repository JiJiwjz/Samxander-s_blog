# Samxander Blog 技术栈文档

> 最后更新：2026-03-21

---

## 架构总览

```
开发环境 (Ubuntu 22.04)
    │
    ├── 编写内容 (Markdown / MDX)
    ├── 本地预览 (bun dev → localhost:4321)
    └── 推送 (Git → GitHub)
            │
            └── 自动部署 (Vercel CI/CD，约 30-40 秒)
                    │
                    └── 线上访问 (samxander.cn)
                            │
                            ├── DNS + CDN (Cloudflare，橙云代理)
                            ├── 评论 / 阅读数 (Waline → Supabase PostgreSQL)
                            └── 搜索 (Pagefind，客户端本地 BM25 索引)
```

---

## 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| [Astro](https://astro.build) | ^5.17.3 | 静态站点生成框架 |
| [astro-pure](https://github.com/cworld1/astro-theme-pure) | 1.4.1 | 博客主题（monorepo，位于 `packages/pure/`） |
| TypeScript | ^5.9.3 | 类型系统 |
| UnoCSS | — | 原子化 CSS 框架（主题内置） |

---

## 运行环境

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 20.x | JS 运行时 |
| Bun | 1.3.11 | 包管理器 / 构建工具（不使用 pnpm） |
| Ubuntu | 22.04 | 开发操作系统 |

> **注意**：项目必须使用 Bun 管理依赖。提交 `pnpm-lock.yaml` 会导致 Vercel 切换为 pnpm，引发 Zod 版本冲突构建失败。

---

## 部署与基础设施

| 技术 | 用途 |
|------|------|
| [Vercel](https://vercel.com) | 托管 + CI/CD，每次 push 自动部署 |
| [Cloudflare](https://cloudflare.com) | DNS 解析 + CDN 加速（橙云代理模式） |
| [GitHub](https://github.com/JiJiwjz/Samxander-s_blog) | 代码仓库 |
| 域名：samxander.cn | 阿里云注册，Cloudflare 解析 |

**部署流程：**
```
git push → GitHub → Vercel 触发构建 (astro build) → 上线
构建时间：约 30-40 秒
```

**Vercel 配置注意事项：**
- Root Directory：留空（不填 `packages/pure`）
- Build Command：`astro build`（默认）
- Install Command：`bun install`

---

## 内容系统

| 技术 | 用途 |
|------|------|
| Markdown / MDX | 博客文章格式 |
| Astro Content Collections | 内容管理，frontmatter 类型校验（Zod schema） |
| [rehype-katex](https://github.com/remarkjs/remark-math) | 数学公式渲染（KaTeX） |
| [remark-math](https://github.com/remarkjs/remark-math) | Markdown 数学公式解析 |
| Shiki | 代码块语法高亮（支持 diff / highlight 标注） |

**文章 frontmatter 格式：**
```yaml
---
title: '文章标题'
publishDate: 2026-03-21        # 注意是 publishDate，不是 date
description: '简短描述，不超过 160 字'
tags:
  - 标签1
  - 标签2
heroImage: { src: './images/thumbnail.jpg', color: '#D58388' }
  # heroImage 可省略；若填写，src 为必填项
---
```

**文章目录结构：**
```
src/content/blog/
└── 文章目录名/
    ├── index.md        # 文章正文
    └── images/         # 文章配图
        └── thumbnail.jpg
```

---

## 功能模块

### 搜索
| 技术 | 说明 |
|------|------|
| [Pagefind](https://pagefind.app) | 构建时生成索引，客户端本地搜索，无需后端 |
| 算法 | BM25（Pagefind 内置） |
| 索引位置 | `dist/pagefind/`（构建时自动生成） |

### 评论 & 阅读数
| 技术 | 说明 |
|------|------|
| [Waline](https://waline.js.org) v3 | 评论系统 + 文章阅读计数 |
| Waline 客户端 | `@waline/client ^3.12.2` |
| Waline 服务端 | 部署于 Vercel，自定义域名：`waline.samxander.cn` |
| 数据库 | [Supabase](https://supabase.com) PostgreSQL（连接池端口 6543，需 `sslmode=require`） |

### 图片优化
| 技术 | 说明 |
|------|------|
| Astro Image (`<Image />`) | 本地图片自动转 WebP/AVIF，按需裁剪 |
| Sharp | 图片处理底层库 |
| medium-zoom | 图片点击放大效果（`.zoomable` class） |

### SEO
| 技术 | 说明 |
|------|------|
| @astrojs/sitemap | 自动生成 `sitemap-index.xml` |
| Open Graph | 文章分享卡片（og:image、og:title 等） |
| Twitter Card | Twitter / X 分享预览 |
| robots.txt | 自动生成（`src/pages/robots.txt.ts`） |
| RSS | 自动生成（`/rss.xml`） |

### 字体
| 技术 | 说明 |
|------|------|
| Satoshi | 主字体，来自 Fontshare，通过 Astro Experimental Fonts 加载 |
| 系统字体 fallback | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |

### 社交统计
| 技术 | 说明 |
|------|------|
| [Substats](https://github.com/spencerwooo/substats) | 实时拉取 GitHub / 知乎 等平台粉丝数 |

---

## 开发工具

| 工具 | 用途 |
|------|------|
| ESLint + eslint-plugin-astro | 代码规范检查 |
| Prettier + prettier-plugin-astro | 代码格式化 |
| push_gui.py (PyQt5) | 一键 Git 推送桌面 GUI 工具 |
| push-blog.desktop | `~/Desktop/` 桌面快捷方式，启动 push_gui.py |

---

## 目录结构

```
blog/
├── src/
│   ├── assets/             # 图片、头像等静态资源
│   ├── components/         # 自定义组件
│   ├── content/
│   │   └── blog/           # 博客文章（每篇一个目录）
│   ├── layouts/            # 页面布局
│   ├── pages/              # 路由页面
│   ├── plugins/            # 自定义 rehype/shiki 插件
│   ├── content.config.ts   # 内容集合 schema 定义
│   └── site.config.ts      # 全局配置（标题、导航、评论等）
├── public/
│   ├── favicon/            # 网站图标
│   └── icons/              # Waline 表情等图标
├── packages/
│   └── pure/               # astro-pure 主题源码（monorepo 子包）
├── astro.config.ts         # Astro 构建配置
├── push_gui.py             # 一键推送 GUI 工具
└── bun.lock                # 依赖锁定文件（必须提交，不可替换为 pnpm-lock.yaml）
```

---

## 常用命令

```bash
# 本地开发
bun dev

# 构建预览（含搜索索引）
bun run build && bun run preview

# 推送到 GitHub（自动触发 Vercel 部署）
git add . && git commit -m "描述" && git push

# 或使用桌面 GUI 工具
python3 push_gui.py
```
