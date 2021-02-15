import { getPrice, getArea, getPricePerUnit } from "./utils";

describe("OLX", () => {
  it("Visits OLX", () => {
    const results = [];

    const {
      location,
      keyword,
      price: { from, to },
    } = Cypress.env().params;

    cy.viewport(1200, 800);

    cy.visit("https://www.olx.pl/nieruchomosci/");

    // accept cookies
    cy.get("#onetrust-accept-btn-handler").click();

    cy.get("#cityField").focus().type(location, { force: true });

    cy.get("#search-submit").click();

    cy.get("#choosecat").click();
    cy.get('[data-name="Działki"]').click({ force: true });

    cy.wait(1000);

    cy.get(
      "#param_price > .filter-both-item > .filter-item-from > .button > .header"
    ).click();
    cy.get(
      "#param_price > .filter-both-item > .filter-item-from > .num-input > .small"
    ).type(from);
    cy.get(
      "#param_price > .filter-both-item > .filter-item-to > .button > .header"
    ).click();
    cy.get(
      "#param_price > .filter-both-item > .filter-item-to > .num-input > .small"
    ).type(to);

    if (keyword) {
      cy.get("#search-text").type(keyword, { force: true });
    }

    cy.get("#search-submit").click();

    cy.get("#offers_table tbody tr.wrap")
      .each(($tile, index) => {
        const data = {
          title: $tile.find("[data-cy=listing-ad-title]").text().trim(),
          url: $tile.find("[data-cy=listing-ad-title]").attr("href"),
          price: $tile.find(".price").text().trim(),
          thumbnail: $tile.find("img.fleft").attr("src"),
        };
        const price = getPrice(data.price);
        const area = getArea(data.title);

        results.push({
          ...data,
          price,
          area,
          pricePerUnit: getPricePerUnit(price, area),
        });
      })
      .then(() => {
        cy.writeFile("data/olx.json", results);
      });

    cy.log(results);
  });
});
