function getColorCode(color) {
    const colorsMap = {
        red: "[31m",
        green: "[32m",
        yellow: "[33m",
        blue: "[34m",
    };
    return colorsMap[color];
}
function color(color, text = '') {
    const colorCode = getColorCode(color);
    return "\x1b" + colorCode + text + "\x1b[0m";
}
function logObject(title, titleColor, data) {
    const dataFormattedString = Object.keys(data)
        .map((key) => "  " + key + " : " + color("yellow", data[key]))
        .join("\n");
    return "\n" + color(titleColor, title) + "\n" + dataFormattedString + "\n";
}
export { color, logObject };
