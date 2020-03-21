import DatabaseManager, {
    IDatabaseManager,
    IGameData
} from "./DatabaseManager";
import { IDataPoint } from "./models/DataPoint";
import { IGame } from "./models/Game";

// const url = "https://beerio-kart-server.herokuapp.com";
const url = "http://localhost:4000";
const MongoDatabaseManager: IDatabaseManager = {
    initialized: false,
    async init() {
        this.initialized = false;
        try {
            const res = await fetch(url);
            const resText = await res.text();
            if (resText === "Welcome") {
                this.initialized = true;
                return true;
            }
        } catch (error) {
            return false;
        }
    },
    async getPlayers() {
        const json = await fetch(url + "/players");
        return json.json();
    },

    async getGameById(id: string) {
        const json = await fetch(url + "/game/" + id);
        return json.json();
    },
    async getAllGames(includeFinished: boolean = false) {
        const games = await (await fetch(url + "/games")).json();
        if (includeFinished) {
            return games;
        }
        return games.filter(
            (g: IGameData) => g.game.history.length < g.game.numRaces
        );
    },
    async newGame(game: IGame) {
        return (
            await (
                await fetch(url + "/game", {
                    body: JSON.stringify(game),
                    method: "POST",
                    headers: { "Content-type": "application/json" }
                })
            ).json()
        )._id;
    },
    async updateGameHistory(
        gameId: string,
        history: number[][],
        courseHistory: number[]
    ) {
        return await (
            await fetch(url + "/game/" + gameId, {
                body: JSON.stringify({ history, courseHistory }),
                method: "PUT",
                headers: { "Content-type": "application/json" }
            })
        ).json();
    },
    async putGame(game: IGame) {
        const { _id, ...updates } = game;
        return await (
            await fetch(url + "/game/" + _id, {
                body: JSON.stringify(updates),
                method: "PUT",
                headers: { "Content-type": "application/json" }
            })
        ).json();
    },
    async addPlayer(name: string) {
        return await (
            await fetch(url + "/player", {
                body: JSON.stringify({ name }),
                method: "POST",
                headers: { "Content-type": "application/json" }
            })
        ).json();
    },
    async getPlayerById(id: string) {
        return (await fetch(url + "/player/" + id)).json();
    },
    async addDataPoint(dataPoint: IDataPoint) {
        const response = await (
            await fetch(url + "/datapoint", {
                body: JSON.stringify(dataPoint),
                method: "POST",
                headers: { "Content-type": "application/json" }
            })
        ).json();
        response.date = new Date(response.date);
        return response;
    },
    async getDataPointsByPlayer(playerId: string) {
        const json = await fetch(url + "/datapoints?player=" + playerId);
        const response = await json.json();
        response.forEach((element: any) => {
            element.date = new Date(element.date);
        });
        return response;
    },
    async deleteGame(game: IGame) {
        if (!game._id) {
            return;
        }
        await fetch(url + "/game/" + game._id, {
            method: "DELETE"
        });
    },
    async deleteDataPoint(dataPoint: IDataPoint) {
        if (!dataPoint._id) {
            return;
        }
        await fetch(url + "/DataPoint/" + dataPoint._id, {
            method: "DELETE"
        });
    },
    async deleteDataPoints(dataPoints: IDataPoint[]) {
        const ids = dataPoints.map(dp => dp._id).filter(id => id);
        await fetch(url + "/DataPoints?ids=" + ids.join(","), {
            method: "DELETE"
        });
    }
};

export const MongoFallbackManager: IDatabaseManager = {
    initialized: false,
    async init() {
        this.initialized = await MongoDatabaseManager.init();
        if (!this.initialized) {
            return DatabaseManager.init();
        }
        return true;
    },
    async getPlayers() {
        if (this.initialized) {
            return MongoDatabaseManager.getPlayers();
        } else {
            return DatabaseManager.getPlayers();
        }
    },

    async getGameById(id: string) {
        if (this.initialized) {
            return MongoDatabaseManager.getGameById(id);
        } else {
            return DatabaseManager.getGameById(id);
        }
    },
    async getAllGames(includeFinished: boolean = false) {
        if (this.initialized) {
            return MongoDatabaseManager.getAllGames(includeFinished);
        } else {
            return DatabaseManager.getAllGames(includeFinished);
        }
    },
    async newGame(game: IGame) {
        if (this.initialized) {
            return MongoDatabaseManager.newGame(game);
        } else {
            return DatabaseManager.newGame(game);
        }
    },
    async updateGameHistory(
        gameId: string,
        history: number[][],
        courseHistory: number[]
    ) {
        if (this.initialized) {
            return MongoDatabaseManager.updateGameHistory(
                gameId,
                history,
                courseHistory
            );
        } else {
            return DatabaseManager.updateGameHistory(
                gameId,
                history,
                courseHistory
            );
        }
    },
    async putGame(game: IGame) {
        if (this.initialized) {
            return MongoDatabaseManager.putGame(game);
        } else {
            return DatabaseManager.putGame(game);
        }
    },
    async addPlayer(name: string) {
        if (this.initialized) {
            return MongoDatabaseManager.addPlayer(name);
        } else {
            return DatabaseManager.addPlayer(name);
        }
    },
    async getPlayerById(id: string) {
        if (this.initialized) {
            return MongoDatabaseManager.getPlayerById(id);
        } else {
            return DatabaseManager.getPlayerById(id);
        }
    },
    async addDataPoint(dataPoint: IDataPoint) {
        if (this.initialized) {
            return MongoDatabaseManager.addDataPoint(dataPoint);
        } else {
            return DatabaseManager.addDataPoint(dataPoint);
        }
    },
    async getDataPointsByPlayer(playerId: string) {
        if (this.initialized) {
            return MongoDatabaseManager.getDataPointsByPlayer(playerId);
        } else {
            return DatabaseManager.getDataPointsByPlayer(playerId);
        }
    },
    async deleteGame(game: IGame) {
        if (this.initialized) {
            return MongoDatabaseManager.deleteGame(game);
        } else {
            return DatabaseManager.deleteGame(game);
        }
    },
    async deleteDataPoint(dataPoint: IDataPoint) {
        if (this.initialized) {
            return MongoDatabaseManager.deleteDataPoint(dataPoint);
        } else {
            return DatabaseManager.deleteDataPoint(dataPoint);
        }
    },
    async deleteDataPoints(dataPoints: IDataPoint[]) {
        if (this.initialized) {
            return MongoDatabaseManager.deleteDataPoints(dataPoints);
        } else {
            return DatabaseManager.deleteDataPoints(dataPoints);
        }
    }
};

export default MongoFallbackManager;
