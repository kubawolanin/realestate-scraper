import { getPrice, getArea, getPricePerUnit } from "./utils";

describe("OLX", () => {
  it("Visits OLX", () => {
    const results = [];

    cy.visit("https://www.olx.pl/nieruchomosci/dzialki/sprzedaz/krakow/");

    // ?search%5Bfilter_enum_type%5D%5B0%5D=dzialki-budowlane&search%5Bfilter_enum_type%5D%5B1%5D=dzialki-rolno-budowlane
    /* ==== Generated with Cypress Studio ==== */

    // accept cookies
    cy.get("#onetrust-accept-btn-handler").click();

    cy.get(
      "#param_price > .filter-both-item > .filter-item-from > .button > .header"
    ).click();
    cy.get(
      "#param_price > .filter-both-item > .filter-item-from > .num-input > .defaultval"
    ).type("10000");
    cy.get(
      "#param_price > .filter-both-item > .filter-item-to > .button > .header"
    ).click();
    cy.get(
      "#param_price > .filter-both-item > .filter-item-to > .button > .header"
    ).click();
    cy.get(
      "#param_price > .filter-both-item > .filter-item-to > .num-input > .defaultval"
    ).type("20000");
    cy.get(
      "#param_m > .filter-both-item > .filter-item-from > .button > .header"
    ).click();
    cy.get(
      "#param_m > .filter-both-item > .filter-item-from > .num-input > .defaultval"
    ).type("100");
    cy.get(
      "#param_m > .filter-both-item > .filter-item-to > .button > .header"
    ).click();
    cy.get(
      "#param_m > .filter-both-item > .filter-item-to > .num-input > .defaultval"
    ).type("20000");
    cy.get(".paramsList__title").click();
    /* ==== End Cypress Studio ==== */

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
