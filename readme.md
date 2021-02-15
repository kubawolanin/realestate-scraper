# realestate-scraper

## Running 

### Standalone
`yarn cypress:open`

or in headless mode:

`yarn cypress:run` 

### Docker
`docker build -t realestate-scraper .`

`docker run -v "./cypress:/app/cypress" -v "./config:/app/config" -v "./services.yml:/app/services.yml" realestate-scraper`

### docker-compose
`docker-compose up`

