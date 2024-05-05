import Signup from "./Signup";
import GetAccount from "./GetAccount";
import RequestRide from "./RequestRide";
import GetRide from "./GetRide";
import MailerGatway from "./MailerGateway";
import { AccountRepositoryDatabase } from "./AccountRepository";
import { RideRepositoryDatabase } from "./RideRepository";
import { PgPromiseAdapter } from "./DatabaseConnection";
import { ExpressAdapter } from "./HttpServer";
import MainController from "./MainController";

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();

const accountRepository = new AccountRepositoryDatabase(connection);
const rideRepository = new RideRepositoryDatabase(connection);
const mailerGateway = new MailerGatway();

const signup = new Signup(accountRepository, mailerGateway);
const getAccount = new GetAccount(accountRepository);
const requestRide = new RequestRide(rideRepository, accountRepository);
const getRide = new GetRide(rideRepository, accountRepository);

new MainController(httpServer, signup, getAccount, requestRide, getRide);

httpServer.listen(3000);