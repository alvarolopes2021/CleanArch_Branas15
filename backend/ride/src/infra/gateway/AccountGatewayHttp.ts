import axios from "axios";
import AccountGateway from "../../application/gateway/AccountGateway";
import HttpClient from "../http/HttpClient";

// interface adapter
export default class AccountGatewayHttp implements AccountGateway {

    constructor(readonly httpClient: HttpClient) {

    }

    async getById(accountId: string): Promise<any> {
        return axios.get(`http://localhost:3001/accounts/${accountId}`);
    }

    async singup(input: any): Promise<any> {
        return axios.post(`http://localhost:3001/signup`, input);
    }

}