function printScores(players: Player[]) {
    players.forEach(p => {
        p.messages = p.currentRoundPoints.displayStrings();
    });
}
export interface IGame {
    _id?: string;
    date?: Date;
    players: string[];
    numRaces: number;
    history: number[][];
    courseHistory: number[];
    characters?: number[];
    vehicles?: number[];
    cc?: number;
    com?: number;
    items?: number;
}
import Player from "../models/Player";
import { KeypadPrompt, CoursePrompt } from "@/components/PromptManager";
import Vue from "vue";
import DatabaseManager from "../MongoDatabaseManager";
import { IGameData } from "@/DatabaseManager";
import { IDataPoint } from "./DataPoint";
import { getColorByPlayerIndex } from "@/Util";
export default class Game {
    public roundNumber: number = -1;
    public datasets: IDataPoint[][] = [];

    public _id?: string;
    constructor(
        public players: Player[] = [],
        public numRaces: number = 8,
        public history: number[][] = [],
        public courseHistory: number[] = [],
        existingId?: string,
        datapoints: IDataPoint[] = []
    ) {
        this.datasets = players.map(p => []);
        const playerIdToIndex: any = {};
        players.forEach((p, i) => (playerIdToIndex[p._id || ""] = i));
        datapoints.forEach(d =>
            this.datasets[playerIdToIndex[d.playerId]].push(d)
        );
        if (existingId) {
            this._id = existingId;
        }
        if (this.history.length) {
            this.repopulateHistory();
        }
    }
    async init() {
        this._id = await DatabaseManager.newGame({
            players: this.players.map(({ _id: id }) => "" + id!),
            numRaces: this.numRaces,
            history: this.history,
            courseHistory: this.courseHistory,
            date: new Date()
        });
    }
    repopulateHistory() {
        this.startGame();
        for (let i = 0; i < this.history.length; i++) {
            const historyItem = this.history[i];
            const course = this.courseHistory[i];
            this.round(course, [...historyItem], true);
        }
    }
    startGame() {
        this.roundNumber = 0;

        // this.datasets.forEach(d => d.splice(0, d.length));
        this.players.forEach((p, i) => {
            p.currentRoundPoints.clear();
            p.extraDict = [];
            p.points.clear();
            p.playerColor = getColorByPlayerIndex(i);
            p.numPlayers = this.players.length;
        });
    }
    round(course: number, raceResults: number[], isUndoing: boolean = false) {
        this.roundNumber += 1;
        if (!isUndoing) {
            this.courseHistory.push(course);
        }
        const lastPlace = Math.max(...raceResults);
        const datapointsToSave = [];
        for (let i = 0; i < this.players.length; i++) {
            const p = this.players[i];

            const addedPoints = raceResults[i];
            const dataPoint: IDataPoint = {
                x: p.totalPoints(),
                y: addedPoints,
                r: 3,
                course,
                gameId: this._id || "",
                playerId: p._id || ""
            };

            if (!isUndoing) {
                DatabaseManager.addDataPoint(dataPoint).then(newDP => {
                    dataPoint._id = newDP._id;
                    dataPoint.date = new Date(newDP.date || "");
                    this.datasets[i].push(dataPoint);
                });
            }
            p.points.combineGroup(p.currentRoundPoints);
            p.currentRoundPoints.clear();
            p.addRacePoints(addedPoints, lastPlace);
            if (this.kanpaiPoints.includes(this.roundNumber)) {
                p.addKanpaiPoint(this.roundNumber);
            }
        }
        let done = false;
        while (!done) {
            for (let p of this.players) {
                const opponents = this.players.filter(x => x !== p);

                while (p.extraDict.length) {
                    const extraPoint = p.extraDict.shift();
                    if (extraPoint) {
                        opponents.forEach(o => {
                            o.addBonusPoint(p.name, extraPoint);
                        });
                    }
                }
            }

            if (!this.players.some(x => x.extraDict.length > 0)) {
                printScores(this.players);
                this.saveGame();
                return;
            }
        }
    }
    undo() {
        this.history.pop();
        const course = this.courseHistory.pop();
        const pointsToDelete = [];
        for (let i = 0; i < this.datasets.length; i++) {
            const dataset = this.datasets[i];
            for (let j = dataset.length - 1; j >= 0; j--) {
                const point = dataset[j];
                if (point.course === course) {
                    dataset.splice(j, 1);
                    pointsToDelete.push(point);
                }
            }
        }
        DatabaseManager.deleteDataPoints(pointsToDelete);
        this.repopulateHistory();
        printScores(this.players);
    }
    saveGame() {
        if (this._id) {
            DatabaseManager.updateGameHistory(
                this._id,
                this.history,
                this.courseHistory
            );
        }
    }
    async promptAll() {
        const course = await CoursePrompt(this.courseHistory);
        const raceResults = [];
        for (let i = 0; i < this.players.length; i++) {
            const p = this.players[i];
            raceResults[i] = await KeypadPrompt(
                p.name,
                this.history.map(t => t[i])
            );
        }
        this.history.push([...raceResults]);
        this.round(course, raceResults);
    }
    get kanpaiPoints() {
        if (+this.numRaces <= 4) {
            return [+this.numRaces];
        } else if (+this.numRaces <= 6) {
            return [3, +this.numRaces];
        } else {
            const kp = [];
            for (let n = 4; n <= +this.numRaces; n += 4) {
                kp.push(n);
            }
            return kp;
        }
    }
}
