import Dexie from "dexie";
import { IPlayer } from "./models/Player";
import { IGame } from "./models/Game";
import { IDataPoint } from "./models/DataPoint";

class KartDatabase extends Dexie {
    players: Dexie.Table<IPlayer, number>;
    games: Dexie.Table<IGame, number>;
    constructor(databaseName: string) {
        super(databaseName);
        this.version(1).stores({
            players: "++id,name",
            games: "++id,*players,numRaces"
        });
        this.games = this.table("games");
        this.players = this.table("players");
    }
}

const db = new KartDatabase("beerio-kart");
export async function init() {
    db.on("populate", async function() {
        // Init your DB with some default statuses:
        const ids = [];
        ids.push(await db.players.add({ name: "Sam" }));
        ids.push(await db.players.add({ name: "Aaron" }));
        ids.push(await db.players.add({ name: "Derrick" }));
        ids.push(await db.players.add({ name: "Eden" }));
        db.games.add({
            history: [
                [1, 2, 3, 4],
                [2, 3, 4, 5]
            ],
            numRaces: 8,
            players: ids
        });
    });

    return db.open();
}
export async function getPlayers() {
    return db.players.toArray();
}
export async function getAllGames(includeFinished: boolean = false) {
    const games = await db.games.toArray();
    if (includeFinished) {
        return games;
    }
    return games.filter(g => g.history.length < g.numRaces);
}
export async function newGame(game: IGame) {
    return await db.games.add(game);
}
export async function addOrUpdateGame(game: IGame) {
    return db.games.put(game);
}
export async function addPlayer(name: string) {
    return db.players.add({ name });
}
export async function getPlayerById(id: number) {
    return db.players.get(id);
}
