---
  title: Hacker News PWA
  tech:
    - React
    - Tailwind CSS
    - API
  description: A progressive web app for browsing Hacker News, built with React. Makes use of a self-hosted API for fetching content. Focuses on small touches missing from similar projects.
  liveLink: https://hn.xdv.com
  githubLink: https://github.com/davelevine/hn-pwa
  image: hn-pwa.webp
  isFeatured: true
  screenshots:
    - screenshot: 01-home.webp
    - screenshot: 02-home.webp
      description: >-
              A progressive web app for browsing Hacker News, built with React. Makes use of a self-hosted API for fetching content. Focuses on small touches missing from similar projects.
---

## Description

A progressive web app for browsing Hacker News, built with React. Makes use of a self-hosted API for fetching content. Focuses on small touches missing from similar projects.

## Key Takeaways

- Single page application (SPA)
  - Built with React + react-router
  - Utilizes the [hackerweb] and [Algolia APIs] for fetching content
- Progressive web app
  - [App manifest]
  - [Service worker]
  - 100/100 Lighthouse score
- [TailwindCSS 2.0]
  - Responsive, mobile first design
  - Light/dark theme available (set automatically based off device theme)

  [hackerweb]: https://github.com/davelevine/node-hnapi
  [Algolia APIs]: https://www.algolia.com/doc/rest-api/search/
  [App manifest]: https://developer.mozilla.org/en-US/docs/Web/Manifest
  [Service worker]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
  [TailwindCSS 2.0]: https://tailwindcss.com/
