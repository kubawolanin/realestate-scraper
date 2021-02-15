# Real estate scraper

Cypress-based tool for crawling real estate offers from the following services:

- Gumtree.pl
- OLX.pl
- Gratka.pl

## Installation

You need a Node.js environment and ability to run headless Chromium (see requirements for running Cypress)

In repository root run

```
yarn
```

If there's a intermittent failure in Cypress installation, try

```
npx cypress install --force
```

## Usage

1. Specify parameters in config/runtime.json (TODO)
2. Run `yarn cypress:open`
3. Choose service of your choice (or run all at once TODO)
4. See data/\*.json files for results

## TODO

- [ ] Parametrized tests (config file)
- [ ] Task for merging all results from `data/*.json`
- [ ] Add timestamps to every crawled entry
- [ ] Task for saving merged results to database (extend config/runtime.json with db connection data)
- [ ] Add filtering (exclude/include keywords)
- [ ] Add searching with keywords
- [ ] Add tests
