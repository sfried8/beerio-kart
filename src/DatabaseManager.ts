import Dexie from "dexie";
import { IPlayer } from "./models/Player";
import { IGame } from "./models/Game";
import { IDataPoint } from "./models/DataPoint";

export interface IGameData {
    game: IGame;
    players: IPlayer[];
    datapoints?: IDataPoint[];
}

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

    getGameById(id: string): Promise<IGameData | undefined>;
    getAllGames(includeFinished: boolean): Promise<IGameData[]>;
    newGame(game: IGame): Promise<string>;
    updateGameHistory(
        gameId: string,
        history: number[][],
        courseHistory: number[]
    ): Promise<string>;
    putGame(game: IGame): Promise<string>;
    addPlayer(name: string): Promise<string>;
    getPlayerById(id: string): Promise<IPlayer | undefined>;
    addDataPoint(dataPoint: IDataPoint): Promise<string>;
    getDataPointsByPlayer(playerId: string): Promise<IDataPoint[]>;
    deleteGame(game: IGame): Promise<any>;
    deleteDataPoint(dataPoint: IDataPoint): Promise<any>;
    deleteDataPoints(dataPoints: IDataPoint[]): Promise<any>;
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
            // const ids = [];
            // DatabaseManager.addPlayer;
            // ids.push(await DatabaseManager.addPlayer("Sam"));
            // ids.push(await DatabaseManager.addPlayer("Aaron"));
            // ids.push(await DatabaseManager.addPlayer("Derrick"));
            // ids.push(await DatabaseManager.addPlayer("Eden"));
            // await db.games.add({
            //     history: [
            //         [1, 2, 3, 4],
            //         [2, 3, 4, 5]
            //     ],
            //     numRaces: 8,
            //     courseHistory:[],
            //     players: ids
            // });
            // db.datapoints.add({ gameId: "", playerId: "1", x: 0, y: 12 });
        });

        return db.open();
    },
    async getPlayers() {
        return db.players.toArray();
    },

    async getGameById(id: string) {
        const game = await db.games
            .where("_id")
            .equals(+id)
            .first();
        if (!game) {
            return;
        }
        const players = await db.players
            .where("_id")
            .anyOf(game.players)
            .toArray();
        const datapoints = await db.datapoints
            .where("gameId")
            .equals(id)
            .toArray();
        return { game, players, datapoints };
    },
    async getAllGames(includeFinished: boolean = false) {
        const gamedatalist = [];

        const games = await db.games.toArray();
        for (const game of games) {
            if (!includeFinished && game.history.length >= game.numRaces) {
                continue;
            }
            const players = await db.players
                .where("_id")
                .anyOf(game.players)
                .toArray();
            const datapoints = await db.datapoints
                .where("gameId")
                .equals(game._id || "")
                .toArray();
            gamedatalist.push({ game, players, datapoints });
        }
        return gamedatalist;
    },
    async newGame(game: IGame) {
        const randomid = getRandomId();
        game._id = randomid;
        await db.games.add(game);
        return randomid;
    },
    async updateGameHistory(
        gameId: string,
        history: number[][],
        courseHistory: number[]
    ) {
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
    },
    async deleteDataPoint(dataPoint: IDataPoint) {
        if (dataPoint._id) {
            db.datapoints.delete(+dataPoint._id);
        }
    },
    async deleteDataPoints(dataPoints: IDataPoint[]) {
        // const ids = dataPoints.map(dp=>dp._id).filter(id=>id);
        // db.datapoints.delete(+dataPoint._id);
    }
};
export default DatabaseManager;
