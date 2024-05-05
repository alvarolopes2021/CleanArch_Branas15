
import sinon from 'sinon';
import GetAccount from '../../src/application/usecase/GetAccount';
import Signup from '../../src/application/usecase/Signup';
import DatabaseConnection, { PgPromiseAdapter } from '../../src/infra/database/DatabaseConnection';
import { AccountRepositoryDatabase } from '../../src/infra/repository/AccountRepository';
import MailerGateway from "../../src/infra/gateway/MailerGateway";

let signup: Signup;
let getAccount: GetAccount;
let connection: DatabaseConnection;

beforeEach(() => {
    connection = new PgPromiseAdapter();
    const accountDAO = new AccountRepositoryDatabase(connection);
    const mailerGateway = new MailerGateway();
    signup = new Signup(accountDAO, mailerGateway);
    getAccount = new GetAccount(accountDAO);
});

test("Deve criar a conta de um passageiro", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }

    //when 
    const output = await signup.execute(input);
    //then
    expect(output.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(output.accountId);

    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    //expect(outputGetAccount.is_passenger).toBe(input.isPassenger); isto está acoplado com o banco no is_passenger
})

test("Não deve criar um passageiro se o nome for inválido", async function () {
    // given
    const input = {
        name: "John",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }
    //when 
    //const outputSignup = await signup(input);
    //then    
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"))
})

test("Não deve criar um passageiro se o email for inválido", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}`,
        cpf: "97456321558",
        isPassenger: true
    }
    //when 
    //const outputSignup = await signup(input);
    //then    
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"))
})

test("Não deve criar um passageiro se o cpf for inválido", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "974563215",
        isPassenger: true
    }
    //when 
    //const outputSignup = await signup(input);
    //then    
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"))
})

test("Não deve criar um passageiro se a conta já existe", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }
    //when     
    await signup.execute(input);
    //const outputSignup = await signup(input);
    //then
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"))
})

test.skip("Não deve criar um passageiro se a placa for inválida", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "AAA999",
        isDriver: true
    }
    //when 
    //const outputSignup = await signup(input);
    //then        
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid car plate"))
})

test("Deve criar a conta de um motorista", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "AAA9999",
        isDriver: true
    }
    //when     
    const output = await signup.execute(input);
    //then
    expect(output.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(output.accountId);

    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isDriver).toBe(input.isDriver);
});

/*
test("Deve criar a conta de um passageiro stub", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }
    const saveStub = sinon.stub(AccountDAODatabase.prototype, "save").resolves();
    const getByEmailStub = sinon.stub(AccountDAODatabase.prototype, "getByEmail").resolves();
    const getByIdStub = sinon.stub(AccountDAODatabase.prototype, "getById").resolves(input);
    //when 
    const output = await signup.execute(input);
    //then
    expect(output.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(output.accountId);

    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    //expect(outputGetAccount.is_passenger).toBe(input.isPassenger); isto está acoplado com o banco no is_passenger

    saveStub.restore();
    getByEmailStub.restore();
    getByIdStub.restore();
})
*/

test("Deve criar a conta de um passageiro spy", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }

    const saveSpy = sinon.spy(AccountRepositoryDatabase.prototype, "save");
    const sendSpy = sinon.spy(MailerGateway.prototype, "send");

    //when 
    const output = await signup.execute(input);
    //then
    expect(output.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(output.accountId);

    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    //expect(outputGetAccount.is_passenger).toBe(input.isPassenger); isto está acoplado com o banco no is_passenger

    expect(saveSpy.calledOnce).toBe(true);

    expect(sendSpy.calledOnce).toBe(true);
    expect(sendSpy.calledWith("Welcome", input.email, "Use this link to confirm your account"));
    saveSpy.restore();
    sendSpy.restore();
})

test("Deve criar a conta de um passageiro mock", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }

    const mailerGatewayMock = sinon.mock(MailerGateway.prototype);
    mailerGatewayMock.expects("send").withArgs("Welcome", input.email, "Use this link to confirm your account").once();


    //when 
    const output = await signup.execute(input);
    //then
    expect(output.accountId).toBeDefined();

    const outputGetAccount = await getAccount.execute(output.accountId);

    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    //expect(outputGetAccount.is_passenger).toBe(input.isPassenger); isto está acoplado com o banco no is_passenger

    mailerGatewayMock.verify();
    mailerGatewayMock.restore();
})

afterEach(async () => {
    await connection.close();
})