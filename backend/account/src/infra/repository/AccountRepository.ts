
import Account from "../../domain/entity/Account";
import DatabaseConnection from "../database/DatabaseConnection";
import AccountModel from "../orm/AccountModel";
import ORM from "../orm/ORM";

// PORT
export default interface AccountRepository {
    save(account: Account): Promise<void>;
    getByEmail(email: string): Promise<Account | undefined>;
    getById(accountId: string): Promise<Account | undefined>;
}

// Adapter Database
export class AccountRepositoryDatabase implements AccountRepository {

    constructor(readonly connection: DatabaseConnection) {

    }

    async save(account: Account) {

        await this.connection.query("insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver]);
    }

    async getByEmail(email: string) {

        const [account] = await this.connection.query("select * from cccat15.account where email = $1", [email]);

        if (!account) return;

        return Account.restore(account.account_id, account.name, account.email, account.cpf, account.is_driver, account.is_passenger, account.car_plate);
    }

    async getById(id: String) {

        const [account] = await this.connection.query("select * from cccat15.account where account_id = $1", [id]);

        if (!account) return;

        return Account.restore(account.account_id, account.name, account.email, account.cpf, account.is_driver, account.is_passenger, account.car_plate);
    }

}

// Adapter Database
export class AccountRepositoryORM implements AccountRepository {
    orm: ORM;
    constructor(readonly connection: DatabaseConnection) {
        this.orm = new ORM(connection);
    }

    async save(account: Account) {
        await this.orm.save(AccountModel.fromAggregate(account));
    }

    async getByEmail(email: string) {

        const [account] = await this.connection.query("select * from cccat15.account where email = $1", [email]);

        if (!account) return;

        return Account.restore(account.account_id, account.name, account.email, account.cpf, account.is_driver, account.is_passenger, account.car_plate);
    }

    async getById(id: String) {

        const [account] = await this.connection.query("select * from cccat15.account where account_id = $1", [id]);

        if (!account) return;

        return Account.restore(account.account_id, account.name, account.email, account.cpf, account.is_driver, account.is_passenger, account.car_plate);
    }

}

// adapter memory
export class AccountDAOMemory implements AccountRepository {

    accounts: any = [];

    async save(account: any): Promise<void> {
        this.accounts.push(account);
    }

    async getByEmail(email: string): Promise<any> {
        return this.accounts.find((account: any) => account.email == email)
    }
    async getById(accountId: string): Promise<any> {
        return this.accounts.find((account: any) => account.accountId == accountId)
    }
}