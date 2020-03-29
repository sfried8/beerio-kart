import { IDataPoint } from "./models/DataPoint";

export function addNumberEnding(num: number) {
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
export function prettyPrintList(list: any[]) {
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

export function prettyPrintNumbers(list: number[]) {
    return prettyPrintList(list.map(addNumberEnding));
}

export function pluralize(word: string, count: number) {
    return word + (count !== 1 ? "s" : "");
}

export function uniquify(arr: any[]) {
    return arr.filter((x, i) => arr.indexOf(x) === i);
}

export function average(arr: number[]) {
    if (!arr || arr.length === 0) {
        return 0;
    }
    return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
}

export function kartScore(places: number[]) {
    return places.reduce((acc, cur) => {
        if (cur === 1) {
            return acc + 15;
        } else if (cur === 2) {
            return acc + 12;
        }
        return acc + 13 - cur;
    }, 0);
}

export function getColorByPlayerIndex(index: number) {
    return ["#ead441", "#6cecfd", "#fe727d", "#3ee413"][index] || "#888888";
}

export function mode<T>(arr: T[]): { value?: T; frequency: number } {
    const numMapping: any = {};
    let greatestFreq = 0;
    let mode;
    arr.forEach(value => {
        if (!value) {
            return;
        }
        numMapping[value] = (numMapping[value] || 0) + 1;

        if (greatestFreq < numMapping[value]) {
            greatestFreq = numMapping[value];
            mode = value;
        }
    });
    return { value: mode, frequency: greatestFreq };
}

export function bestAndWorstCourse(datapoints: IDataPoint[]) {
    const mapping: any = {};
    datapoints.forEach(dp => {
        if (!dp.course) {
            return;
        }

        if (!mapping[dp.course]) {
            mapping[dp.course] = [];
        }
        mapping[dp.course].push(dp.y);
    });
    const bestCourse = { value: 0, average: Infinity, frequency: 0 };
    const worstCourse = { value: 0, average: -Infinity, frequency: 0 };
    for (const course in mapping) {
        if (mapping.hasOwnProperty(course)) {
            const points = mapping[+course];
            const ave = average(points);
            if (
                ave &&
                (ave < bestCourse.average ||
                    (ave === bestCourse.average &&
                        points.length > bestCourse.frequency))
            ) {
                bestCourse.value = +course;
                bestCourse.average = ave;
                bestCourse.frequency = points.length;
            }
            if (
                ave &&
                (ave > worstCourse.average ||
                    (ave === worstCourse.average &&
                        points.length > worstCourse.frequency))
            ) {
                worstCourse.value = +course;
                worstCourse.average = ave;
                worstCourse.frequency = points.length;
            }
        }
    }
    return { best: bestCourse.value, worst: worstCourse.value };
}
