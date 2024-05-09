import DatabaseConnection from "../database/DatabaseConnection";
import Ride from "../../domain/entity/Ride";

// PORT
export default interface RideRepository {
    save(ride: Ride): Promise<void>;
    get(rideId: string): Promise<Ride | undefined>;
    getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
    update(ride: Ride): Promise<void>;
}

// Adapter Database
export class RideRepositoryDatabase implements RideRepository {

    constructor(readonly connection: DatabaseConnection) {

    }

    async save(ride: Ride) {
        //const connection = await connectDb();

        await this.connection.query("insert into cccat15.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.getStatus(), ride.date]);

    }

    async get(rideId: string): Promise<any> {
        const [ride] = await this.connection.query("select * from cccat15.ride where ride_id = $1", [rideId]);

        if (!ride) return;

        return Ride.restore(ride.ride_id, ride.passenger_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_Lat), parseFloat(ride.to_long), ride.status, ride.date, ride.driver_id);
    }

    async getActiveRidesByPassengerId(passengerId: string): Promise<any> {

        const activeRidesData = await this.connection.query("select * from cccat15.ride where passenger_id = $1 and status = 'requested'", [passengerId]);

        const activeRides: Ride[] = [];

        for (const activeRideData of activeRidesData) {

            activeRides.push(Ride.restore(activeRideData.ride_id, activeRideData.passenger_id, parseFloat(activeRideData.from_lat), parseFloat(activeRideData.from_long), parseFloat(activeRideData.to_Lat), parseFloat(activeRideData.to_long), activeRideData.status, activeRideData.date, activeRideData.driver_id))

        }

        return activeRides;
    }


    async update(ride: Ride): Promise<void> {
        await this.connection.query("update cccat15.ride set status = $1, driver_id = $2 where ride_id = $3", [ride.getStatus(), ride.getDriverId(), ride.rideId]);
    }

}
