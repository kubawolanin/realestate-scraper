export const getPrice = (priceString) =>
  Number(priceString.replace(/[^0-9\.]+/g, ""));

/**
 *
 * @param {string} description
 * @return {number} area in a (0,01ha)
 */
export const getArea = (description) => {
  const re = /([0-9,]+)(\s)?(m2|[Aa]r?|[Hh]a)/;
  const match = description.match(re);
  if (!match) {
    return null;
  }

  let area = Number(match[1].replace(",", "."));
  let unit = match[3].toLowerCase();

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
export const getPricePerUnit = (price, area) => {
  if (!area || !price) {
    return null;
  }

  const pricePerUnit = Math.ceil(price / area);

  return pricePerUnit;
};
