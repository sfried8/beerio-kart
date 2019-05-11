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
  clone() {
    return new Point(this.source, this.extraData);
  }
}
class PointGroup {
  constructor() {
    this.points = {
      [SOURCE_TYPE.RACE]: [],
      [SOURCE_TYPE.KANPAI]: []
    };
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
    return Object.values(this.points).reduce((acc, cur) => acc + cur.length, 0);
  }
  displayStrings() {
    const strs = [];
    for (const s in this.points) {
      const len = this.points[s].length;
      if (len === 0) {
        continue;
      }
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
        console.log(s);
        strs.push(
          `${pointString} from ${s}'s ${Util.prettyPrintNumbers(
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
