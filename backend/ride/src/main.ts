import RequestRide from "./application/usecase/RequestRide";
import GetRide from "./application/usecase/GetRide";
import MailerGatway from "./infra/gateway/MailerGateway";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import MainController from "./infra/http/MainController";
import Registry from "./infra/di/Registry";
import AccountGatewayHttp from "./infra/gateway/AccountGatewayHttp";
import { AxiosAdapter } from "./infra/http/HttpClient";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();

const rideRepository = new RideRepositoryDatabase(connection);
const mailerGateway = new MailerGatway();
const accountGateway = new AccountGatewayHttp(new AxiosAdapter());

const requestRide = new RequestRide(rideRepository, accountGateway);
const getRide = new GetRide(rideRepository, accountGateway);
const registry = Registry.getInstance();
registry.register("requestRide", requestRide);
registry.register("getRide", getRide);

new MainController(httpServer);

httpServer.listen(3000);