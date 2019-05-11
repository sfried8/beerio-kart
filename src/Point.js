import * as Util from "./Util";
const SOURCE_TYPE = {
  RACE: "_RACE",
  KANPAI: "_KANPAI"
};
class Point {
  constructor(source, extraData) {
    this.source = source;
    this.extraData = extraData;
  }
}
const PointManager = {
  PointGroup: class {
    constructor() {
      this.points = {};
      for (const s of SOURCE_TYPE) {
        this.points[s] = [];
      }
    }
    addPoint(point) {
      if (!this.points[point.source]) {
        this.points[point.source] = [];
      }
      this.points[point.source].push(point);
    }
    amount() {
      return this.points.values().reduce((acc, cur) => acc + cur.length, 0);
    }
    displayString() {
      const strs = [];
      for (const s in this.points) {
        const len = this.points[s].length;
        const pointString = `${len} point${len === 1 ? "" : "s"}`;
        if (s === SOURCE_TYPE.RACE) {
          strs.push(`${pointString} from the race`);
        } else if (s === SOURCE_TYPE.KANPAI) {
          strs.push(
            `${pointString} because it's the ${Util.addNumberEnding(
              this.points[s][0].extraData
            )} race`
          );
        } else {
          strs.push(
            `${pointString} from ${s}'s ${Util.prettyPrintNumbers(
              this.points[s].map(p => p.extraData)
            )} point${len === 1 ? "" : "s"}`
          );
        }
      }
      return strs;
    }
    addRacePoints(quantity) {
      for (let i = 0; i < quantity; i++) {
        this.addPoint(new Point(SOURCE_TYPE.RACE));
      }
    }
    addKanpaiPoint(roundNumber) {
      this.addPoint(new Point(SOURCE_TYPE.KANPAI, roundNumber));
    }
    addBonusPoint(source, triggeringPointNumber) {
      this.addPoint(new Point(source, triggeringPointNumber));
    }
  }
};

export default PointManager;
