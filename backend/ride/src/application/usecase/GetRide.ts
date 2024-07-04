import RideRepository from "../../infra/repository/RideRepository";
import AccountGateway from "../gateway/AccountGateway";

// API Composition - pois faz buscas em outras API's
export default class GetRide {
    constructor(readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway) {

    }

    async execute(rideId: string): Promise<Output> {
        const ride = await this.rideRepository.get(rideId);
        if (!ride) throw new Error("Ride not found")
        const passenger = await this.accountGateway.getById(ride.passengerId);
        if (!passenger) throw new Error("Passenger not found")
        const driverId = ride.getDriverId();
        let driver;
        if (driverId) {
            driver = await this.accountGateway.getById(driverId);
        }

        const data: Output = {
            passengerId: ride.passengerId,
            driverId: ride.getDriverId(),
            rideId: ride.rideId,
            fromLat: ride.getFromLat(),
            fromLong: ride.getFromLong(),
            toLat: ride.getToLat(),
            toLong: ride.getToLong(),
            status: ride.getStatus(),
            lastLat: ride.getLastLat(),
            lastLong: ride.getLastLong(),
            distance: ride.getDistance(),
            fare: ride.getFare(),
            date: ride.date,
            passengerName: passenger.name
        };

        if (driver){
            data.driverName = driver.name
        }
        
        return data;
    }
}

type Output = {
    passengerId: string,
    driverId?: string,
    rideId: string,
    fromLat: number,
    toLat: number,
    fromLong: number,
    toLong: number,
    status: string,
    lastLat: number,
    lastLong: number,
    distance: number,
    fare: number,
    date: Date,
    passengerName: string,
    driverName?: string
}