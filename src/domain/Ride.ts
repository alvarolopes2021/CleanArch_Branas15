import crypto from 'crypto';

// é entidade pois muda com passar do tempo, o accpet() muda o estado
export default class Ride {
    constructor(
        readonly rideId: string,
        readonly passengerId: string,
        readonly fromLat: number,
        readonly fromLong: number,
        readonly toLat: number,
        readonly toLong: number,
        private status: string,
        readonly date: Date,
        private driverId?: string) {

        if (fromLat < -90 && fromLat > 90) throw new Error("wrong lat")

    }

    static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
        const rideId = crypto.randomUUID();
        const status = "requested";
        const date = new Date();
        return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date);
    }

    static restore(rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date, driveId?: string) {

        return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date);
    }

    accept(driveId: string) {
        if (this.status !== "requested") throw new Error("Invalid status");

        this.status = "accepted";
        this.driverId = driveId;
    }

    start(rideId: string){
        if (this.status !== "accepted") throw new Error("Invalid status")
        this.status = "in_progress"
    }

    getStatus() {
        return this.status;
    }

    getDriverId(){
        return this.driverId;
    }
}