export const cleanDecimal = (decimal: string | number, round = 2) => {
  if (typeof decimal === "string") {
    return String(parseFloat(decimal).toFixed(round)).replace(/\.00/, "");
  } else if (typeof decimal === "number") {
    return String(decimal.toFixed(round)).replace(/\.00/, "");
  } else {
    return "0";
  }
};
