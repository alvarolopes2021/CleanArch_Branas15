import axios from "axios";
import AccountGateway from "../../application/gateway/AccountGateway";
import HttpClient from "../http/HttpClient";

// interface adapter
export default class AccountGatewayHttp implements AccountGateway {

    constructor(readonly httpClient: HttpClient) {

    }

    async getById(accountId: string): Promise<any> {
        return this.httpClient.get(`http://localhost:3001/accounts/${accountId}`);
    }

    async singup(input: any): Promise<any> {
        return this.httpClient.post(`http://localhost:3001/signup`, input);
    }

}