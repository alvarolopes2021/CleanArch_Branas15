//import AccountDAO, { AccountDAODatabase } from "./AccountDAO";

import AccountRepository from "../../infra/repository/AccountRepository";

export default class GetAccount {
	constructor(readonly accountRepository: AccountRepository) {

	}

	async execute(accountId: string) {
		const acc = await this.accountRepository.getById(accountId);

		if (!acc) throw new Error("Account doesn exist");
		
		return acc;

	}
}
