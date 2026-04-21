---
  title: Journalistic
  tech:
    - Nuxt.js
    - Vue
    - TypeScript
    - Tailwind CSS
    - Fastify
    - Node.js
    - SQLite
    - Docker
  description: A self-hosted micro-journaling app where your data stays yours. Capture daily thoughts as bullet points, organize with #tags and @mentions, and rediscover old memories as they resurface over time.

  liveLink: https://journal-dev.levine.io
  githubComingSoon: true
  image: https://cdn.levine.io/uploads/portfolio/public/images/projects/journalistic-write.webp
  isFeatured: true

---

## Description

A self-hosted micro-journaling app inspired by [Journalistic], rebuilt for self-hosting. Every interaction is designed to remove friction — bullets save automatically as you type. No formatting decisions, no folder structure, no distractions. Just write.

Everything lives in a single SQLite file you control. No cloud accounts, no subscriptions, no vendor lock-in. An optional Litestream sidecar replicates the file to S3-compatible storage continuously, giving you point-in-time recovery without running a separate database server.

## Key Takeaways

* All data lives in a single [SQLite] file, with optional [Litestream] replication to S3-compatible storage for continuous backup.
* Reflect dashboard that resurfaces yesterday's entry, memories from one year ago, weekly highlights, and random moments from the past.
* Inline [#tags and @people] with browse, group, and alias support.
* Location tagging with auto-captured weather via [Open-Meteo], browsable on an interactive [MapLibre] map.
* Full [PWA] support with a three-layer cache (memory, localStorage, IndexedDB) for instant offline navigation.
* Optional [Dreams, Wisdom, Ideas, and Notes] modules that stay hidden until enabled.

  [Journalistic]: https://journalisticapp.com
  [SQLite]: https://www.sqlite.org/
  [Litestream]: https://litestream.io/
  [#tags and @people]: https://journal-dev.levine.io
  [Open-Meteo]: https://open-meteo.com/
  [MapLibre]: https://maplibre.org/
  [PWA]: https://web.dev/progressive-web-apps/
  [Dreams, Wisdom, Ideas, and Notes]: https://journal-dev.levine.io
