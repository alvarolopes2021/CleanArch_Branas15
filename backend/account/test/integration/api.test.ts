import axios from "axios";

axios.defaults.validateStatus = function () {
    return true;
}

test.skip("Deve criar a conta de um passageiro", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }

    //when 
    const response = await axios.post("http://localhost:3001/signup", input);
    //then
    const outputSignup = response.data;

    expect(outputSignup.accountId).toBeDefined();

    const responseGetAccount = await axios.get(`http://localhost:3001/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;

    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
})

test("Deve criar a conta de um passageiro de forma assincrona", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }

    //when 
    const response = await axios.post("http://localhost:3001/signupAsync", input);
    
})
