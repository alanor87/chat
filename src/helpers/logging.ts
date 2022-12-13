type ColorType = "red" | "green" | "yellow" | "blue";

function getColorCode(color: ColorType) {
  const colorsMap = {
    red: "[31m",
    green: "[32m",
    yellow: "[33m",
    blue: "[34m",
  };

  return colorsMap[color];
}

function color(color: ColorType, text: string | number = '') {
  const colorCode = getColorCode(color);
  return "\x1b" + colorCode + text + "\x1b[0m";
}

function logObject(
  title: string,
  titleColor: ColorType,
  data: { [key: string]: string | number }
) {
  const dataFormattedString = Object.keys(data)
    .map((key) => "  " + key + " : " + color("yellow", data[key]))
    .join("\n");
  return "\n" + color(titleColor, title) + "\n" + dataFormattedString + "\n";
}

export { color, logObject };
