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
}
import Player from "../models/Player";
import { KeypadPrompt } from "@/components/KeypadPrompt";
import Vue from "vue";
import DatabaseManager from "../MongoDatabaseManager";
import { IGameData } from "@/DatabaseManager";
export default class Game {
    public raceResults: number[];
    public roundNumber: number = -1;
    public datasets: { x: number; y: number }[][] = [];
    public _id?: string;
    constructor(
        public players: Player[] = [],
        public numRaces: number = 8,
        public history: number[][] = [],
        existingId?: string
    ) {
        this.raceResults = [];
        this.datasets = players.map(p => []);
        if (existingId) {
            this._id = existingId;
        }
        if (this.history.length) {
            this.repopulateHistory();
        }
    }
    async init() {
        return DatabaseManager.newGame({
            players: this.players.map(({ _id: id }) => "" + id!),
            numRaces: this.numRaces,
            history: this.history,
            date: new Date()
        }).then(id => {
            this._id = id;
            // this.players.forEach((p, i) => {
            //     DatabaseManager.getDataPointsByPlayer(p._id || "").then(dps => {
            //         Vue.set(
            //             this.datasets,
            //             i,
            //             dps
            //                 .filter(dp => dp.gameId != this._id)
            //                 .map(({ x, y }) => ({ x, y }))
            //         );
            //     });
            // });
        });
    }
    repopulateHistory() {
        this.startGame();
        for (const historyItem of this.history) {
            this.raceResults = [...historyItem];
            this.round(true);
        }
    }
    startGame() {
        this.roundNumber = 0;

        this.datasets.forEach(d => d.splice(0, d.length));
        // this.players.forEach((p, i) => {
        //     DatabaseManager.getDataPointsByPlayer(p._id || "").then(dps => {
        //         Vue.set(
        //             this.datasets,
        //             i,
        //             dps.map(({ x, y }) => ({ x, y }))
        //         );
        //     });
        // });
        this.players.forEach((p, i) => {
            p.currentRoundPoints.clear();
            p.extraDict = [];
            p.points.clear();
            p.playerColor = ["#fae451", "#6cecfd", "#fe727d", "#3ee413"][i];
            p.numPlayers = this.players.length;
        });
    }
    round(isUndoing: boolean = false) {
        this.roundNumber += 1;

        const lastPlace = Math.max(...this.raceResults);
        for (let i = 0; i < this.players.length; i++) {
            const p = this.players[i];

            const addedPoints = this.raceResults[i];
            const dataPoint = { x: p.totalPoints(), y: addedPoints };

            if (!isUndoing && this._id && p._id) {
                DatabaseManager.addDataPoint({
                    ...dataPoint,
                    gameId: this._id,
                    playerId: p._id
                });
            }
            this.datasets[i].push(dataPoint);
            this.raceResults[i] = 0;
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
        this.repopulateHistory();
        printScores(this.players);
    }
    saveGame() {
        // const iGameData: IGame = {
        //     id: this.id,
        //     players: this.players.map(({ id }) => id!),
        //     numRaces: this.numRaces,
        //     history: this.history
        // };
        if (this._id) {
            DatabaseManager.updateGameHistory(this._id, this.history);
        }
    }
    async promptAll() {
        for (let i = 0; i < this.players.length; i++) {
            const p = this.players[i];
            this.raceResults[i] = await KeypadPrompt(p.name);
        }
        this.history.push([...this.raceResults]);
        this.round();
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
