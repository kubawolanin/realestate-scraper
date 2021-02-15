import { getPrice } from "./getPrice";

/**
 *
 * @param {string} description
 * @return {number} area in a (0,01ha)
 */
const getArea = (description) => {
  const re = /([0-9,]+)(\s)?(m2|ar?|ha)/;
  const match = description.match(re);
  if (!match) {
    return null;
  }

  let area = Number(match[1].replace(",", "."));
  let unit = match[3];

  // normalize unit
  if (unit === "ar") {
    unit = "a";
  } else if (unit === "m2") {
    unit = "a";
    area = area / 100;
  } else if (unit === "ha") {
    unit = "a";
    area = area * 100;
  }

  return area;
};

/**
 * @param {number} price
 * @param {number} area
 * @return {number} price / a
 */
const getPricePerUnit = (price, area) => {
  if (!area || !price) {
    return null;
  }

  const pricePerUnit = Math.ceil(price / area);

  return pricePerUnit;
};

describe("Gumtree", () => {
  it("Visits Gumtree", () => {
    cy.visit(
      "https://www.gumtree.pl/s-dzialki/krakow/v1c9194l3200208p1?pr=10000,20000"
    );

    /* ==== Generated with Cypress Studio ==== */
    // cy.get("#onetrust-accept-btn-handler").click();
    // cy.get("#attr\\.Price\\.amountMin").type("10000");
    // cy.get("#attr\\.Price\\.amountMax").type("20000");
    // cy.get(".icon-chevron-white-right").click();
    // /* ==== End Cypress Studio ==== */
    cy.get(".results .view")
      .children(".tileV1")
      .map((tile) => {
        const $tile = Cypress.$(tile);
        const data = {
          title: $tile.find("a.tile-title-text").text().trim(),
          url: $tile.find("a.tile-title-text").attr("href"),
          description: $tile.find(".description").text().trim(),
          price: $tile.find(".info .ad-price").text().trim(),
          thumbnail: $tile.find(".bolt-image img").attr("src"),
        };
        const price = getPrice(data.price);
        const area = getArea(data.description);

        return {
          ...data,
          price,
          area,
          pricePerUnit: getPricePerUnit(price, area),
        };
      });
  });
});
