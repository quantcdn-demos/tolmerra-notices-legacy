# Tolmerra Water Authority: legacy notices site (demonstration)

A fictional "legacy" public notices site, made for a Quant video and guide about copying an old site to static
content. Tolmerra Water Authority, its places, notices, numbers and addresses are invented. Phone numbers are from the
ACMA list of numbers for fictional use, and e-mail addresses use the reserved `.example` domain.

It only looks old. It is a small Node.js 24 server with no dependencies that serves fixed pages:

- GET and HEAD only; every other method gets 405, and a request body is never read.
- Each response is a file from `site/`, chosen by an exact route table (`site/routes.json`). No templates, scripts,
  database or shell at request time.
- The staff login page answers 401 and has no form. Search answers a fixed page.
- It sends an old-style `Server` banner (fictional) and `X-Robots-Tag: noindex, nofollow`, and robots.txt disallows
  everything.
- The image runs as the non-root `node` user, and the files are not writable.

## Run

```sh
npm test
npm start            # http://localhost:8080/
docker compose up    # the same, in a read-only container
```

`node scripts/generate.mjs` writes the pages from `scripts/content.mjs`; `scripts/images.sh` draws the GIFs
(ImageMagick). The workflow in `.github/workflows/image.yml` tests and publishes
`ghcr.io/quantcdn-demos/tolmerra-notices-legacy`.
