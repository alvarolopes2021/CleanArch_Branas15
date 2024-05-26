export default interface AccountGateway{
    getById(accountId: string) : Promise <any>;
    singup(input: any): Promise<any>;
}