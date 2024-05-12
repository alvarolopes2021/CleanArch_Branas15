import generateId from "../../utils/crypto";
import Coord from "../vo/Coord";

export default class Position {
    private coord: Coord;

    constructor(readonly positionId: string, readonly rideId: string, lat: number, long: number, readonly date: Date) {
        this.coord = new Coord(lat, long);
    }

    static create(rideId: string, lat: number, long: number) {
        const positionId = generateId();
        const date = new Date();
        return new Position(positionId, rideId, lat, long, date)
    }

    static restore(rideId: string, lat: number, long: number) {
        const positionId = generateId();
        const date = new Date();
        return new Position(positionId, rideId, lat, long, date)
    }

    getLat() {
        return this.coord.getLat();
    }

    getLong() {
        return this.coord.getLong();
    }
}