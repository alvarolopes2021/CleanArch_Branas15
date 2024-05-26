import AccountGateway from "../../src/application/gateway/AccountGateway";
import AcceptRide from "../../src/application/usecase/AcceptRide";
import GetPositions from "../../src/application/usecase/GetPositions";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import StartRide from "../../src/application/usecase/StartRide";
import UpdatePosition from "../../src/application/usecase/UpdatePosition";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import AccountGatewayHttp from "../../src/infra/gateway/AccountGatewayHttp";
import MailerGatway from "../../src/infra/gateway/MailerGateway";
import { AxiosAdapter } from "../../src/infra/http/HttpClient";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let connection: DatabaseConnection;
let accountGateway: AccountGateway;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let getPositions: GetPositions;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const rideRepository = new RideRepositoryDatabase(connection);
    accountGateway = new AccountGatewayHttp(new AxiosAdapter());
    const positionRepository = new PositionRepositoryDatabase(connection);

    requestRide = new RequestRide(rideRepository, accountGateway);
    getRide = new GetRide(rideRepository, accountGateway);
    acceptRide = new AcceptRide(rideRepository, accountGateway);
    startRide = new StartRide(rideRepository);
    updatePosition = new UpdatePosition(rideRepository, positionRepository);
    getPositions = new GetPositions(positionRepository);
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

    const inputUpdatePosition = {
        rideId: outputRequestRide.rideId,
        lat: -27.496887588317275,
        long: -48.522234807851476
    }

    await updatePosition.execute(inputUpdatePosition);

    const outputGetRide = await getRide.execute(outputRequestRide.rideId);
    expect(outputGetRide.distance).toBe(10);
    expect(outputGetRide.lastLat).toBe(-27.496887588317275);
    expect(outputGetRide.lastLong).toBe(-48.522234807851476);

    const outputGetPositions = await getPositions.execute(outputRequestRide.rideId);

    expect(outputGetPositions[0].lat).toBe(-27.496887588317275);
    expect(outputGetPositions[0].long).toBe(-48.522234807851476);

})

afterEach(async () => {
    await connection.close();
})