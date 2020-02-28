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
            players: "++id,_id,name",
            games: "++id,_id,*players,numRaces",
            datapoints: "++id,_id,playerId,gameId"
        });
        this.games = this.table("games");
        this.players = this.table("players");
        this.datapoints = this.table("datapoints");
    }
}

const db = new KartDatabase("beerio-kart");
export interface IDatabaseManager {
    init(): Promise<any>;
    getPlayers(): Promise<IPlayer[]>;

    getGameById(id: string): Promise<IGame | undefined>;
    getAllGames(includeFinished: boolean): Promise<IGame[]>;
    newGame(game: IGame): Promise<string>;
    updateGameHistory(gameId: string, history: number[][]): Promise<string>;
    putGame(game: IGame): Promise<string>;
    addPlayer(name: string): Promise<string>;
    getPlayerById(id: string): Promise<IPlayer | undefined>;
    addDataPoint(dataPoint: IDataPoint): Promise<string>;
    getDataPointsByPlayer(playerId: string): Promise<IDataPoint[]>;
    deleteGame(game: IGame): Promise<any>;
}

const getRandomId = () =>
    "" + (Math.floor(Math.random() * 100000000) + 100000000);
const DatabaseManager: IDatabaseManager = {
    async init() {
        if (db.isOpen()) {
            return Promise.resolve();
        }
        db.on("populate", async function() {
            // Init your DB with some default statuses:
            const ids = [];
            DatabaseManager.addPlayer;
            ids.push(await DatabaseManager.addPlayer("Sam"));
            ids.push(await DatabaseManager.addPlayer("Aaron"));
            ids.push(await DatabaseManager.addPlayer("Derrick"));
            ids.push(await DatabaseManager.addPlayer("Eden"));
            await db.games.add({
                history: [
                    [1, 2, 3, 4],
                    [2, 3, 4, 5]
                ],
                numRaces: 8,
                players: ids
            });
            db.datapoints.add({ gameId: "", playerId: "1", x: 0, y: 12 });
        });

        return db.open();
    },
    async getPlayers() {
        return db.players.toArray();
    },

    async getGameById(id: string) {
        return db.games
            .where("_id")
            .equals(+id)
            .first();
    },
    async getAllGames(includeFinished: boolean = false) {
        const games = await db.games.toArray();
        if (includeFinished) {
            return games;
        }
        return games.filter(g => g.history.length < g.numRaces);
    },
    async newGame(game: IGame) {
        const randomid = getRandomId();
        game._id = randomid;
        await db.games.add(game);
        return randomid;
    },
    async updateGameHistory(gameId: string, history: number[][]) {
        return "" + (await db.games.update(+gameId, { history }));
    },
    async putGame(game: IGame) {
        return "" + (await db.games.put(game));
    },
    async addPlayer(name: string) {
        const randomid = getRandomId();
        await db.players.add({ name, _id: randomid });
        return randomid;
    },
    async getPlayerById(id: string) {
        return await db.players
            .where("_id")
            .equals(id)
            .first();
    },
    async addDataPoint(dataPoint: IDataPoint) {
        return "" + (await db.datapoints.add(dataPoint));
    },
    async getDataPointsByPlayer(playerId: string) {
        return db.datapoints
            .where("playerId")
            .equals(playerId)
            .toArray();
    },
    async deleteGame(game: IGame) {
        if (!game._id) {
            return;
        }
        await db.games.delete(+game._id);
        await db.datapoints
            .where("gameId")
            .equals(game._id)
            .delete();
    }
};
export default DatabaseManager;
