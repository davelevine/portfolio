---
  title: Hacker News PWA
  tech:
    - Node.js
    - React
    - Redis
    - Tailwind CSS
  description: A progressive web app for browsing Hacker News, built with React. Makes use of a self-hosted API for fetching content. Focuses on small touches missing from similar projects.
  liveLink: https://hn.xdv.com
  githubLink: https://github.com/davelevine/hn-pwa
  image: hn-pwa.webp
  isFeatured: true

---

## Description

A progressive web app for browsing Hacker News, built with React. Makes use of a self-hosted API for fetching content. Focuses on small touches missing from similar projects.

## Key Takeaways

- Single Page Application (SPA)
  - Developed using React and react-router
  - Fetches content via [hackerweb] and [Algolia APIs]
- Progressive Web App (PWA)
  - Includes an [App manifest]
  - Employs a [Service worker]
  - Achieves a perfect 100/100 Lighthouse score
- Styled with [TailwindCSS 2.0]
  - Features a responsive, mobile-first design
  - Automatically adapts to light/dark themes based on device settings

  [hackerweb]: https://github.com/davelevine/node-hnapi
  [Algolia APIs]: https://www.algolia.com/doc/rest-api/search/
  [App manifest]: https://developer.mozilla.org/en-US/docs/Web/Manifest
  [Service worker]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
  [TailwindCSS 2.0]: https://tailwindcss.com/
