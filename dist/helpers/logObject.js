function logObject(title = "red", titleColor, data) {
    let titleColorCode = '\x1b';
    switch (titleColor) {
        case "red": {
            titleColorCode += "[31m";
            break;
        }
        case "green": {
            titleColorCode += "[32m";
            break;
        }
        case "yellow": {
            titleColorCode += "[31m";
            break;
        }
        case "blue": {
            titleColorCode += "[34m";
            break;
        }
        default: {
            titleColorCode += "";
        }
    }
    const dataFormattedString = Object.keys(data)
        .map((key) => "  " + key + " : " + "\x1b[33m" + data[key] + "\x1b[0m")
        .join("\n");
    console.log(titleColorCode + title + "\x1b[0m" + "\n" + dataFormattedString);
}
export { logObject };
