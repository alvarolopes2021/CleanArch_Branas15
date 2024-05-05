import MailerGatway from "../../infra/gateway/MailerGateway";
import Account from '../../domain/Account';
import AccountRepository from "../../infra/repository/AccountRepository";

// use case
export default class Signup {
	// port
	constructor(readonly accountRepository: AccountRepository, readonly mailerGateway: MailerGatway) {
	}
	async execute(input: any): Promise<any> {

		const existingAccount = await this.accountRepository.getByEmail(input.email);

		if (existingAccount) throw new Error("Account already exists");

		const account = Account.create(input.name, input.email, input.cpf, input.isDriver, input.isPassenger, input.carPlate);

		await this.accountRepository.save(account);

		await this.mailerGateway.send("Welcome", input.email, "Use this link to confirm your account");

		return {
			accountId: account.accountId
		};
	}
}
