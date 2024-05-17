import { PgPromiseAdapter } from "../../src/infra/database/DatabaseConnection";
import AccountModel from "../../src/infra/orm/AccountModel";
import ORM from "../../src/infra/orm/ORM";
import generateId from "../../src/utils/crypto";

test("deve testar o ORM", async function () {
    //given

    //modelo de persistecia
    const accountId = generateId();
    const accountModel = new AccountModel(accountId, "John Doe", "john.doe@gmail.com", "11.111.111.11", "", true, false);

    const conneciton = new PgPromiseAdapter();
    const orm = new ORM(conneciton);

    //when
    await orm.save(accountModel);

    //then
    const savedAccountModel = await orm.findBy(AccountModel, "account_id", accountId);
    expect(savedAccountModel.name).toBe("John Doe");
    expect(savedAccountModel.cpf).toBe("11.111.111.11");
    expect(savedAccountModel.carPlate).toBe("");
    await conneciton.close();

});