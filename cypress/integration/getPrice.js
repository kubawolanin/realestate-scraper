export const getPrice = (priceString) =>
  Number(priceString.replace(/[^0-9\.]+/g, ""));
