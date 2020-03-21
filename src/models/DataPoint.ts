export interface IDataPoint {
    _id?: string;
    playerId: string;
    gameId: string;
    course?: number;
    date?: Date | string;
    x: number;
    y: number;
    r: number;
    vehicle?: number;
    cc?: number;
    com?: number;
    items?: number;
    character?: number;
}
