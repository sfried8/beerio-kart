import Dexie from "dexie";
import { IPlayer } from "./models/Player";
import { IGame } from "./models/Game";
import { IDataPoint } from "./models/DataPoint";

class KartDatabase extends Dexie {
    players: Dexie.Table<IPlayer, number>;
    games: Dexie.Table<IGame, number>;
    datapoints: Dexie.Table<IDataPoint, number>;
    constructor(databaseName: string) {
        super(databaseName);
        this.version(1).stores({
            players: "++id,name",
            games: "++id,*players,numRaces",
            datapoints: "++id,playerId,gameId"
        });
        this.games = this.table("games");
        this.players = this.table("players");
        this.datapoints = this.table("datapoints");
    }
}

const db = new KartDatabase("beerio-kart");

export default {
    async init() {
        if (db.isOpen()) {
            return Promise.resolve();
        }
        db.on("populate", async function() {
            // Init your DB with some default statuses:
            const ids = [];
            ids.push(await db.players.add({ name: "Sam" }));
            ids.push(await db.players.add({ name: "Aaron" }));
            ids.push(await db.players.add({ name: "Derrick" }));
            ids.push(await db.players.add({ name: "Eden" }));
            await db.games.add({
                history: [
                    [1, 2, 3, 4],
                    [2, 3, 4, 5]
                ],
                numRaces: 8,
                players: ids
            });
            db.datapoints.add({ gameId: -1, playerId: 1, x: 0, y: 12 });
        });

        return db.open();
    },
    async getPlayers() {
        return db.players.toArray();
    },

    async getGameById(id: number) {
        return db.games.get(id);
    },
    async getAllGames(includeFinished: boolean = false) {
        const games = await db.games.toArray();
        if (includeFinished) {
            return games;
        }
        return games.filter(g => g.history.length < g.numRaces);
    },
    async newGame(game: IGame) {
        return await db.games.add(game);
    },
    async updateGameHistory(gameId: number, history: number[][]) {
        return db.games.update(gameId, { history });
    },
    async putGame(game: IGame) {
        return db.games.put(game);
    },
    async addPlayer(name: string) {
        return db.players.add({ name });
    },
    async getPlayerById(id: number) {
        return db.players.get(id);
    },
    async addDataPoint(dataPoint: IDataPoint) {
        return db.datapoints.add(dataPoint);
    },
    async getDataPointsByPlayer(playerId: number) {
        return db.datapoints
            .where("playerId")
            .equals(playerId)
            .toArray();
    },
    async deleteGame(game: IGame) {
        if (!game.id) {
            return;
        }
        await db.games.delete(game.id);
        await db.datapoints
            .where("gameId")
            .equals(game.id)
            .delete();
    }
};
