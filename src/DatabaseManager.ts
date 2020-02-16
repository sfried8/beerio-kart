import Dexie from "dexie";
import { IPlayer } from "./models/Player";

class KartDatabase extends Dexie {
    players: Dexie.Table<IPlayer, number>;
    constructor(databaseName: string) {
        super(databaseName);
        this.version(1).stores({
            players: "++id,name"
        });
        this.players = this.table("players");
    }
}

const db = new KartDatabase("beerio-kart");
export async function init() {
    db.on("populate", function() {
        // Init your DB with some default statuses:
        db.players.add({ name: "Sam" });
        db.players.add({ name: "Aaron" });
        db.players.add({ name: "Derrick" });
        db.players.add({ name: "Eden" });
    });

    return db.open();
}
export async function getPlayers() {
    return db.players.toArray();
}
export async function addPlayer(name: string) {
    return db.players.add({ name });
}
