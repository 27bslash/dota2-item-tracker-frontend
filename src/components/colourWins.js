const colourWins = (val) => {
  val = +val;
  if (+val < 50 && +val > 30) {
    return `hsl(0, 100%, ${val}%)`;
  } else if (+val <= 30) {
    return "hsl(0,100%, 30%)";
  } else if (+val > 80) {
    return "rgb(120 255 152)";
  } else {
    return `hsl(134, 100%, ${val}%)`;
  }
};
export default colourWins;
