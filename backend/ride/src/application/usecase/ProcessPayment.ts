import RideRepository from "../../infra/repository/RideRepository";

export default class ProcessPayment {
    constructor(readonly rideRepository: RideRepository) {

    }

    execute(input: Input) {
        console.log("processPayment", input);
    }
}

type Input = {
    rideId: string,
    creditCarToken: string,
    amaout: number
}