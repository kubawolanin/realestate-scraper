import { getPrice, getArea, getPricePerUnit } from "./utils";

const getThumbnail = (thumbnail) => {
  if (thumbnail?.startsWith("http")) {
    return thumbnail;
  }

  return null;
};

describe("Gumtree", () => {
  it("Visits Gumtree", () => {
    const results = [];

    const {
      location,
      keyword,
      price: { from, to },
    } = Cypress.env().params;

    cy.viewport(1200, 800);

    cy.visit("https://www.gumtree.pl/");

    // TODO: make it configurable?
    cy.get(".category-list a:contains(działki)").click();
    cy.get(".location").click();
    cy.get("div.location > div.options ul")
      .find(`li a:contains(${location})`)
      .click({ force: true }); // element is not visible
    if (keyword) {
      cy.get(".searchbar .keyword input").type(keyword, { force: true });
    }

    cy.get(".searchbar .button").click();

    // Accept cookies
    cy.get("#onetrust-accept-btn-handler").click();
    // Set the price range
    cy.get("#attr\\.Price\\.amountMin").type(from);
    cy.get("#attr\\.Price\\.amountMax").type(to);
    cy.get(".icon-chevron-white-right").click();

    // Process the results
    cy.get(".results .view .tileV1")
      .each(($tile) => {
        const data = {
          title: $tile.find("a.tile-title-text").text().trim(),
          url: `https://www.gumtree.pl${$tile
            .find("a.tile-title-text")
            .attr("href")}`,
          description: $tile.find(".description").text().trim(),
          price: $tile.find(".info .ad-price").text().trim(),
          thumbnail: $tile.find(".bolt-image img").attr("src"),
        };
        const price = getPrice(data.price);
        const area = getArea(data.description);
        const thumbnail = getThumbnail(data.thumbnail);

        results.push({
          ...data,
          price,
          area,
          thumbnail,
          pricePerUnit: getPricePerUnit(price, area),
        });
      })
      .then(() => {
        cy.writeFile("data/gumtree.json", results);
      });

    cy.log(results);
  });
});
