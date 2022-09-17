<img width="1280" alt="og-img" src="https://user-images.githubusercontent.com/36589645/190708125-306d1d90-036a-4aab-a02a-02abfb76ded4.png">


# 📑 Read release notes for multiple packages on a single page


It's a pain to search for release notes of different packages while upgrading a project. That's why created this project. 

[You can read this tweet for more info](https://twitter.com/abhagsain/status/1569352819941216257)


## Installation

1. Clone this repo
2. `npm i` and `npm run dev` 

## Contributing Guide

There's a rate-limit (10 req/minute) for unauthenticated users for Github's API. 
That's why I'm caching the response With [Cloudflare Worker's KV](https://www.cloudflare.com/products/workers-kv/) so you will need to create an account on Cloudflare and install [Wrangler CLI (Please Follow the instructions)](https://developers.cloudflare.com/workers/wrangler/) 

Don't worry you won't be charged anything, there's a generous free limit of 100K req/day.

Once the CLI is installed create a KV namespae

- `wrangler kv:namespace create RELEASE` & `wrangler kv:namespace create RELEASE --preview`
- Replace the `id` and `preview_id` (from the second command 👆) in `wrangler.toml`
- Now you can run `npm run worker-dev` to run the worker locally and `npm run worker-publish` to publish your changes to Cloudflare. (Again you won't be charged anyting for publishing the worker)

## Found this useful?

<img width="400" alt="og-img" src="https://user-images.githubusercontent.com/36589645/190842490-03fb820c-4efd-4c8e-ba1f-c6e680c94433.gif">


## Tech Stack


This projet uses

- [TypeScript](https://typescriptlang.org/)
- [Remix](https://remix.run/docs/en/v1)
- [TailwindCSS](https://tailwindcss.com/)
- [Itty Router](https://github.com/kwhitley/itty-router) for CF Worker routing

__ 

Love to build stuff? 

Connect with me on [Twitter](https://twitter.com/abhagsain) or [LinkedIn](https://linkedin.com/in/anurag-bhagsain/) :)
