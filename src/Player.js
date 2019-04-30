export default class Player {
    constructor(name1) {
        if (typeof name1 === "string") {
            this.name = name1;
            this.points = [];
            this.currentRoundPoints = [];
            this.pendingPoints = 0;
            this.extraDict = [];
            this.messages = [];
            this.history = [];
        } else if (name1 && name1.name) {
            this.name = name1.name;
            this.points = name1.points;
            this.currentRoundPoints = name1.currentRoundPoints;
            this.pendingPoints = name1.pendingPoints;
            this.extraDict = name1.extraDict;
            this.messages = name1.messages;
            this.history = name1.history;
        }
    }
    saveState() {
        this.history.push({
            points: [...this.points],
            currentRoundPoints: [...this.currentRoundPoints],
            extraDict: [...this.extraDict],
            messages: [...this.messages]
        });
    }
    undo() {
        const lastState = this.history.pop();
        this.points = lastState.points;
        this.currentRoundPoints = lastState.currentRoundPoints;
        this.extraDict = lastState.extraDict;
        this.messages = lastState.messages;
        this.pendingPoints = 0;
    }
    totalPoints() {
        return this.points.length + this.currentRoundPoints.length;
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
