import HttpServer from "./HttpServer";
import Registry, { inject } from "../di/Registry";

export default class MainController {

    constructor(httpServer: HttpServer) {
        const registry = Registry.getInstance();
       
        httpServer.register('post', '/request_ride', async function (params: any, body: any) {

            const output = await registry.inject("requestRide").execute(body);
            return output;
        });

        httpServer.register('get', '/rides/:rideId', async function (params: any, body: any) {
            const ride = await registry.inject("getRide").execute(params.rideId);
            return ride;
        });

    }


}