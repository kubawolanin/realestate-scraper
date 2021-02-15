FROM cypress/base:14.15.4
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn
COPY cypress.json .
COPY cypress.env.json .

ENTRYPOINT yarn cypress:run