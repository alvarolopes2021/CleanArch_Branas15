import HttpServer from "./HttpServer";
import Signup from "../../application/usecase/Signup";
import Registry, { inject } from "../di/Registry";
import Queue from "../queue/Queue";

export default class MainController {
    @inject("signup")
    signup?: Signup;

    @inject('queue')
    queue?: Queue; 

    constructor(httpServer: HttpServer) {
        const registry = Registry.getInstance();

        httpServer.register('post', '/signup', async (params: any, body: any) => {

            const output = await this.signup?.execute(body);
            return output;
        });

        //command
        httpServer.register('post', '/signupAsync', async (params: any, body: any) => {            
            this.queue?.publish("signup", body);            
        });

        httpServer.register('get', '/accounts/:accountId', async function (params: any, body: any) {

            const output = await registry.inject("getAccount").execute(params.accountId);
            return output;
        });


    }


}