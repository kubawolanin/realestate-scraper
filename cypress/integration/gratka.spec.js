import { getPrice } from "./utils";

const getArea = (areaString) => Number(areaString.replace(/[^0-9\.]+/g, ""));

describe("gratka", () => {
  it("Visits gratka", () => {
    const results = [];

    // TODO: Get these from config file
    const location = "Kraków";
    const from = 100000;
    const to = 200000;
    const keyword = "";

    cy.visit("https://gratka.pl/nieruchomosci/");
    cy.get(".crossDialog__decisionPositive").click();

    cy.get(".listingCategoryField .mockInput").click({ force: true });
    cy.get(".category__categoryName:contains(Działki)").click({
      force: true,
    });
    cy.get(
      ".category__chooseCurrentCategory:contains(Wszystkie w Działki)"
    ).click({ force: true });

    cy.wait(1000);

    cy.get(".locationSuggester input")
      .scrollIntoView()
      .type(location, { force: true });
    cy.get(".category__inputHints .category__hint:eq(0)").click({
      force: true,
    });

    cy.get(".generator__twoFields:eq(0)").click({ force: true });
    cy.get("[name=cena-calkowita_min]:eq(0)").type(from);
    cy.get("[name=cena-calkowita_max]:eq(0)").type(to);

    if (keyword) {
      cy.get(".generator__toggleSearchFullView").click({ force: true });
      cy.get(".listingSearchBar__input").type(keyword, { force: true });
    }

    cy.get(".generator__applyFilters").click({ force: true });

    cy.get(".listing__content article.teaserUnified")
      .each(($tile) => {
        const data = {
          title: $tile.find("a.teaserUnified__anchor").text().trim(),
          url: $tile.find("a.teaserUnified__anchor").attr("href"),
          description: $tile.find(".teaserUnified__description").text().trim(),
          price: getPrice(
            $tile
              .find(".teaserUnified__price")[0]
              .childNodes[0]?.nodeValue.trim()
          ),
          pricePerUnit: getPrice(
            $tile
              .find(".teaserUnified__additionalPrice")?.[0]
              .childNodes[0]?.nodeValue.trim()
          ),
          area: getArea(
            $tile
              .find(".teaserUnified__params .teaserUnified__listItem")[0]
              .childNodes[0]?.nodeValue.trim() // TODO: childNodes of undefined
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
