import { PointGroup } from "./Point";
type HistoryItem = {
    place: number;
    points: PointGroup;
    currentRoundPoints: PointGroup;
    extraDict: number[];
};
export default class Player {
    public name: string;
    public points: PointGroup;
    public currentRoundPoints: PointGroup;
    public extraDict: number[];
    public messages: string[];
    public history: HistoryItem[];
    public numPlayers: number = 0;
    public playerColor: string | undefined;
    constructor(name1: string) {
        this.name = name1;
        this.points = new PointGroup();
        this.currentRoundPoints = new PointGroup();
        this.extraDict = [];
        this.messages = [];
        this.history = [];
    }
    totalPoints() {
        return this.points.amount() + this.currentRoundPoints.amount();
    }
    addRacePoints(place: number, lastPlace: number) {
        if (place === lastPlace) {
            this.currentRoundPoints.addLastPlacePoint(place);
            this.checkForBonus();
        }
        if (place % 4 === 0) {
            this.currentRoundPoints.addFourthPoint(place);
            this.checkForBonus();
        }
    }
    addKanpaiPoint(roundNumber: number) {
        this.currentRoundPoints.addKanpaiPoint(roundNumber);
        this.checkForBonus();
    }
    addBonusPoint(source: string, triggeringPointNumber: number) {
        this.currentRoundPoints.addBonusPoint(source, triggeringPointNumber);
        this.checkForBonus();
    }
    checkForBonus() {
        if (this.totalPoints() % this.numPlayers === 0) {
            this.extraDict.push(this.totalPoints());
        }
    }
}
