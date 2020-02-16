import Point from "./Point";
export default class Player {
    constructor(name1) {
        if (typeof name1 === "string") {
            this.name = name1;
            this.points = new Point.PointGroup();
            this.currentRoundPoints = new Point.PointGroup();
            this.pendingPoints = 0;
            this.extraDict = [];
            this.messages = [];
            this.history = [];
        } else if (name1 && name1.name) {
            this.name = name1.name;
            this.points = Point.PointGroup.cloneOf(name1.points);
            this.currentRoundPoints = Point.PointGroup.cloneOf(
                name1.currentRoundPoints
            );
            this.pendingPoints = name1.pendingPoints;
            this.extraDict = name1.extraDict;
            this.messages = name1.messages;
            this.history = name1.history;
        }
    }
    saveState() {
        this.history.push({
            place: this.pendingPoints,
            points: this.points.clone(),
            currentRoundPoints: this.currentRoundPoints.clone(),
            extraDict: [...this.extraDict]
        });
    }
    undo() {
        const lastState = this.history.pop();
        this.points = Point.PointGroup.cloneOf(lastState.points);
        this.currentRoundPoints = Point.PointGroup.cloneOf(
            lastState.currentRoundPoints
        );
        this.extraDict = lastState.extraDict;
        this.pendingPoints = 0;
    }
    totalPoints() {
        return this.points.amount() + this.currentRoundPoints.amount();
    }
    addRacePoints(place, lastPlace) {
        if (place === lastPlace) {
            this.currentRoundPoints.addLastPlacePoint(place);
            this.checkForBonus();
        }
        if (place % 4 === 0) {
            this.currentRoundPoints.addFourthPoint(place);
            this.checkForBonus();
        }
    }
    addKanpaiPoint(roundNumber) {
        this.currentRoundPoints.addKanpaiPoint(roundNumber);
        this.checkForBonus();
    }
    addBonusPoint(source, triggeringPointNumber) {
        this.currentRoundPoints.addBonusPoint(source, triggeringPointNumber);
        this.checkForBonus();
    }
    checkForBonus() {
        if (this.totalPoints() % this.numPlayers === 0) {
            this.extraDict.push(this.totalPoints());
        }
    }
    addPoints(toAdd, fromWhom, pointNumber, numPlayers) {
        for (var i = 0; i < toAdd; i++) {
            this.currentRoundPoints.push([fromWhom, pointNumber]);
            if (this.totalPoints() % numPlayers === 0) {
                this.extraDict.push(this.totalPoints());
            }
        }
    }
}
