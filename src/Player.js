export default class Player {
    constructor(name1) {
        this.name = name1;
        this.points = 0;
        this.currentRoundPoints = 0;
        this.pendingPoints = 0;
        this.fromDict = [];
        this.toDistribute = 0;
        this.extraDict = [];
        this.messages = [];
    }
    addPoints(toAdd, fromWhom, pointNumber, numPlayers) {
        for (var i = 0; i < toAdd; i++) {
            this.currentRoundPoints += 1;
            this.fromDict[this.fromDict.length] = [fromWhom, pointNumber];
            if ((this.points + this.currentRoundPoints) % numPlayers === 0) {
                this.toDistribute += 1;
                this.extraDict[this.extraDict.length] =
                    this.points + this.currentRoundPoints;
            }
        }
    }
}
