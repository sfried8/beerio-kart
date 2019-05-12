import * as Util from "./Util";
const SOURCE_TYPE = {
    LAST_PLACE: "_L",
    MULTIPLE_OF_4: "_M",
    KANPAI: "_K"
};
class Point {
    constructor(source, extraData) {
        this.source = source;
        this.extraData = extraData;
    }
    clone() {
        return new Point(this.source, this.extraData);
    }
}
class PointGroup {
    constructor() {
        this.points = {
            [SOURCE_TYPE.LAST_PLACE]: [],
            [SOURCE_TYPE.KANPAI]: []
        };
    }
    static cloneOf(other) {
        const newPointGroup = new PointGroup();
        newPointGroup.combineGroup(other);
        return newPointGroup;
    }
    clone() {
        const newPointGroup = new PointGroup();
        newPointGroup.combineGroup(this);
        return newPointGroup;
    }
    addPoint(point) {
        if (!this.points[point.source]) {
            this.points[point.source] = [];
        }
        this.points[point.source].push(point);
    }
    amount() {
        return Object.values(this.points).reduce(
            (acc, cur) => acc + cur.length,
            0
        );
    }
    displayStrings() {
        const strs = [];
        for (const s in this.points) {
            const len = this.points[s].length;
            if (len === 0) {
                continue;
            }
            const pointString = `(${len})`;
            if (s === SOURCE_TYPE.LAST_PLACE) {
                strs.push(
                    `${pointString} came in ${Util.addNumberEnding(
                        this.points[s][0].extraData
                    )} (last)`
                );
            } else if (s === SOURCE_TYPE.MULTIPLE_OF_4) {
                strs.push(
                    `${pointString} came in ${Util.addNumberEnding(
                        this.points[s][0].extraData
                    )} (mod 4)`
                );
            } else if (s === SOURCE_TYPE.KANPAI) {
                strs.push(
                    `${pointString} it's the ${Util.addNumberEnding(
                        this.points[s][0].extraData
                    )} race`
                );
            } else {
                strs.push(
                    `${pointString} ${s}'s ${Util.prettyPrintNumbers(
                        this.points[s].map(p => p.extraData)
                    )} point${len === 1 ? "" : "s"}`
                );
            }
        }
        return strs;
    }
    combineGroup(otherGroup) {
        for (const s in otherGroup.points) {
            if (!this.points[s]) {
                this.points[s] = [];
            }
            this.points[s].push(...otherGroup.points[s]);
        }
    }
    addLastPlacePoint(place) {
        this.addPoint(new Point(SOURCE_TYPE.LAST_PLACE, place));
    }
    addFourthPoint(place) {
        this.addPoint(new Point(SOURCE_TYPE.MULTIPLE_OF_4, place));
    }
    addKanpaiPoint(roundNumber) {
        this.addPoint(new Point(SOURCE_TYPE.KANPAI, roundNumber));
    }
    addBonusPoint(source, triggeringPointNumber) {
        this.addPoint(new Point(source, triggeringPointNumber));
    }
    clear() {
        for (const s in this.points) {
            this.points[s] = [];
        }
    }
}
const PointManager = {
    Point,
    PointGroup
};

export default PointManager;
