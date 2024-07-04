import DomainEvent from "./DomainEvent";

export default class RideCompletedEvent implements DomainEvent {
    name: string = "rideCompleted";

    constructor (readonly rideId: string, readonly creditCardToken: string, readonly amount: number){

    }
}