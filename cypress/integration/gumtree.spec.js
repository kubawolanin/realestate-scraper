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

    const from = 10000;
    const to = 20000;

    cy.visit(
      `https://www.gumtree.pl/s-dzialki/krakow/v1c9194l3200208p1?pr=${from},${to}`
    );

    /* ==== Generated with Cypress Studio ==== */
    // cy.get("#onetrust-accept-btn-handler").click();
    // cy.get("#attr\\.Price\\.amountMin").type("10000");
    // cy.get("#attr\\.Price\\.amountMax").type("20000");
    // cy.get(".icon-chevron-white-right").click();
    // /* ==== End Cypress Studio ==== */
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
