export function addNumberEnding(num) {
    if (!num) {
        return "";
    }
    if (Math.floor((num % 100) / 10) == 1) {
        return num + "th";
    }
    switch (num % 10) {
        case 1:
            return num + "st";
        case 2:
            return num + "nd";
        case 3:
            return num + "rd";
        default:
            return num + "th";
    }
}
export function prettyPrintList(list) {
    if (!list || list.length === 0) {
        return "";
    } else if (list.length === 1) {
        return list[0];
    } else if (list.length === 2) {
        return list[0] + " and " + list[1];
    } else {
        var string = "";
        for (var i = 0; i < list.length - 1; i++) {
            string += list[i] + ", ";
        }
        return string + "and " + list[list.length - 1];
    }
}

export function prettyPrintNumbers(list) {
    for (var i = 0; i < list.length; i++) {
        list[i] = addNumberEnding(list[i]);
    }
    return prettyPrintList(list);
}

export function pluralize(word, count) {
    return word + (count !== 1 ? "s" : "");
}

export function uniquify(arr) {
    return arr.filter((x, i) => arr.indexOf(x) === i);
}

export function average(arr) {
    if (!arr || arr.length === 0) {
        return 0;
    }
    return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
}
