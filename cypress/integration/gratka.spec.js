import { getPrice } from "./utils";

const getArea = (areaString) => Number(areaString.replace(/[^0-9\.]+/g, ""));

describe("gratka", () => {
  it("Visits gratka", () => {
    const results = [];

    cy.visit(
      "https://gratka.pl/nieruchomosci/dzialki-grunty/budowlana/krakow?cena-calkowita:min=100000&cena-calkowita:max=200000"
    );
    /* ==== Generated with Cypress Studio ==== */
    cy.get(".crossDialog__decisionPositive").click();

    // cy.get("#powierzchnia-dzialki-w-m2-min-desktop-search-1304619753").type(
    //   "500"
    // );
    // cy.get("#powierzchnia-dzialki-w-m2-max-desktop-search-1304619753").type(
    //   "10000{backspace}"
    // );
    cy.get(".generator__filterTools").click();
    cy.get(".generator__applyFilters").click();
    /* ==== End Cypress Studio ==== */

    cy.get(".listing__content article.teaserUnified")
      .each(($tile) => {
        const data = {
          title: $tile.find("a.teaserUnified__anchor").text().trim(),
          url: $tile.find("a.teaserUnified__anchor").attr("href"),
          description: $tile.find(".teaserUnified__description").text().trim(),
          price: getPrice(
            $tile
              .find(".teaserUnified__price")[0]
              .childNodes[0].nodeValue.trim()
          ),
          pricePerUnit: getPrice(
            $tile
              .find(".teaserUnified__additionalPrice")[0]
              .childNodes[0].nodeValue.trim()
          ),
          area: getArea(
            $tile
              .find(".teaserUnified__params .teaserUnified__listItem")[0]
              .childNodes[0].nodeValue.trim()
          ),
          thumbnail: $tile.find(".teaserUnified__img").attr("src"),
        };

        results.push({
          ...data,
        });
      })
      .then(() => {
        cy.writeFile("data/gratka.json", results);
      });

    cy.log(results);
  });
});
