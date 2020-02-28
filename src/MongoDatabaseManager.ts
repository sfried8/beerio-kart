import DatabaseManager, { IDatabaseManager } from "./DatabaseManager";
import { IDataPoint } from "./models/DataPoint";
import { IGame } from "./models/Game";

const url = "http://localhost:4000";
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
        return games.filter((g: IGame) => g.history.length < g.numRaces);
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
    async updateGameHistory(gameId: string, history: number[][]) {
        return await (
            await fetch(url + "/game/" + gameId, {
                body: JSON.stringify({ history }),
                method: "PUT",
                headers: { "Content-type": "application/json" }
            })
        ).json();
    },
    async putGame(game: IGame) {
        return "0"; //db.games.put(game);
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
        return "0"; //db.datapoints.add(dataPoint);
    },
    async getDataPointsByPlayer(playerId: string) {
        // return db.datapoints
        //     .where("playerId")
        //     .equals(playerId)
        //     .toArray();
        return [];
    },
    async deleteGame(game: IGame) {
        if (!game._id) {
            return;
        }
        await fetch(url + "/game/" + game._id, {
            method: "DELETE"
        });
    }
};
export default MongoDatabaseManager;
