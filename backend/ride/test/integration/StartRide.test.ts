import AccountGateway from "../../src/application/gateway/AccountGateway";
import UpdateRideProjectionHandler from "../../src/application/handler/UpdateRideProjectionHandler";
import GetRideProjectionQuery from "../../src/application/query/GetRideProjectionQuery";
import GetRideQuery from "../../src/application/query/GetRideQuery";
import AcceptRide from "../../src/application/usecase/AcceptRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import StartRide from "../../src/application/usecase/StartRide";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import AccountGatewayHttp from "../../src/infra/gateway/AccountGatewayHttp";
import MailerGatway from "../../src/infra/gateway/MailerGateway";
import { AxiosAdapter } from "../../src/infra/http/HttpClient";
import { RabbitMQAdapter } from "../../src/infra/queue/Queue";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let connection: DatabaseConnection;
let accountGateway: AccountGateway;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

beforeEach(async() => {
    connection = new PgPromiseAdapter();
    accountGateway = new AccountGatewayHttp(new AxiosAdapter());
    const rideRepository = new RideRepositoryDatabase(connection);
    requestRide = new RequestRide(rideRepository, accountGateway);
    getRide = new GetRide(rideRepository, accountGateway);
    acceptRide = new AcceptRide(rideRepository, accountGateway);
    const queue = new RabbitMQAdapter();
    await queue.connect();
    startRide = new StartRide(rideRepository, queue);
})

test("Deve iniciar uma corrida", async function () {
    // given
    const inputSignupPassenger = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }
    const outputSignupPassenger = await accountGateway.singup(inputSignupPassenger);

    //then
    const inputRequestRide = {
        passengerId: outputSignupPassenger.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }
    const outputRequestRide = await requestRide.execute(inputRequestRide);


    const inputSignupDriver = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "AAA9999",
        isDriver: true
    }
    const outputSignupDriver = await accountGateway.singup(inputSignupDriver);


    const inputAcceptRide = {
        rideId: outputRequestRide.rideId,
        driverId: outputSignupDriver.accountId
    };
    await acceptRide.execute(inputAcceptRide);


    const inputStartRide = {
        rideId: outputRequestRide.rideId
    }
    await startRide.execute(inputStartRide);


    // const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    // expect(outputGetRide.status).toBe("in_progress");
    // const getRideQuery = new GetRideQuery(connection);
    // const outputGetRideQuery = getRideQuery.execute(outputRequestRide.rideId);
    // console.log(outputGetRideQuery);

    const updateRideProjectionHandler = new UpdateRideProjectionHandler(connection);
    await updateRideProjectionHandler.execute(outputRequestRide.rideId);
    const getRideProjectionQuery = new GetRideProjectionQuery(connection);
    const outputGetRidePorjectionQuery = await  getRideProjectionQuery.execute(outputRequestRide.rideId)
    console.log(outputGetRidePorjectionQuery);

})

afterEach(async () => {
    await connection.close();
})