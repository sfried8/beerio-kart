import * as Util from "./Util";
type PointGroupMap = Record<string, Point[]>;
const SOURCE_TYPE = {
    LAST_PLACE: "_L",
    MULTIPLE_OF_4: "_M",
    KANPAI: "_K"
};
export class Point {
    constructor(public source: string, public extraData?: number) {
        this.source = source;
        this.extraData = extraData;
    }
    clone() {
        return new Point(this.source, this.extraData);
    }
}
export class PointGroup {
    public points: PointGroupMap;
    constructor() {
        this.points = {
            [SOURCE_TYPE.LAST_PLACE]: [],
            [SOURCE_TYPE.KANPAI]: []
        };
    }
    static cloneOf(other: PointGroup) {
        const newPointGroup = new PointGroup();
        newPointGroup.combineGroup(other);
        return newPointGroup;
    }
    clone() {
        const newPointGroup = new PointGroup();
        newPointGroup.combineGroup(this);
        return newPointGroup;
    }
    addPoint(point: Point) {
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
                        this.points[s][0].extraData || 0
                    )} (last)`
                );
            } else if (s === SOURCE_TYPE.MULTIPLE_OF_4) {
                strs.push(
                    `${pointString} came in ${Util.addNumberEnding(
                        this.points[s][0].extraData || 0
                    )} (mod 4)`
                );
            } else if (s === SOURCE_TYPE.KANPAI) {
                strs.push(
                    `${pointString} it's the ${Util.addNumberEnding(
                        this.points[s][0].extraData || 0
                    )} race`
                );
            } else {
                strs.push(
                    `${pointString} ${s}'s ${Util.prettyPrintNumbers(
                        this.points[s].map(p => p.extraData || 0)
                    )} point${len === 1 ? "" : "s"}`
                );
            }
        }
        return strs;
    }
    combineGroup(otherGroup: PointGroup) {
        for (const s in otherGroup.points) {
            if (!this.points[s]) {
                this.points[s] = [];
            }
            this.points[s].push(...otherGroup.points[s]);
        }
    }
    addLastPlacePoint(place: number) {
        this.addPoint(new Point(SOURCE_TYPE.LAST_PLACE, place));
    }
    addFourthPoint(place: number) {
        this.addPoint(new Point(SOURCE_TYPE.MULTIPLE_OF_4, place));
    }
    addKanpaiPoint(roundNumber: number) {
        this.addPoint(new Point(SOURCE_TYPE.KANPAI, roundNumber));
    }
    addBonusPoint(source: string, triggeringPointNumber: number) {
        this.addPoint(new Point(source, triggeringPointNumber));
    }
    clear() {
        for (const s in this.points) {
            this.points[s] = [];
        }
    }
}
