import { IDatabaseManager } from "./DatabaseManager";
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

    async getGameById(id: number) {
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
        return await (
            await fetch(url + "/game", {
                body: JSON.stringify(game),
                method: "POST"
            })
        ).json();
    },
    async updateGameHistory(gameId: number, history: number[][]) {
        // return db.games.update(gameId, { history });
        return 0;
    },
    async putGame(game: IGame) {
        return 0; //db.games.put(game);
    },
    async addPlayer(name: string) {
        return await (
            await fetch(url + "/player", {
                body: JSON.stringify({ name }),
                method: "POST",
                mode: "no-cors"
            })
        ).json();
    },
    async getPlayerById(id: number) {
        return (await fetch(url + "/player/" + id)).json();
    },
    async addDataPoint(dataPoint: IDataPoint) {
        return 0; //db.datapoints.add(dataPoint);
    },
    async getDataPointsByPlayer(playerId: number) {
        // return db.datapoints
        //     .where("playerId")
        //     .equals(playerId)
        //     .toArray();
        return [];
    },
    async deleteGame(game: IGame) {
        // if (!game.id) {
        //     return;
        // }
        // await db.games.delete(game.id);
        // await db.datapoints
        //     .where("gameId")
        //     .equals(game.id)
        //     .delete();
    }
};
export default MongoDatabaseManager;
