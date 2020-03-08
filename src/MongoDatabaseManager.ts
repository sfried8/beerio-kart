import { IDatabaseManager, IGameData } from "./DatabaseManager";
import { IDataPoint } from "./models/DataPoint";
import { IGame } from "./models/Game";

const url = "https://beerio-kart-server.herokuapp.com";
const MongoDatabaseManager: IDatabaseManager = {
    async init() {
        return true;
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
export default MongoDatabaseManager;
