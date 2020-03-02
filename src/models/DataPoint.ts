export interface IDataPoint {
    _id?: string;
    playerId: string;
    gameId: string;
    course?: number;
    x: number;
    y: number;
}
