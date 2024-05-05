import axios from "axios";

axios.defaults.validateStatus = function () {
    return true;
}

test("Deve criar a conta de um passageiro", async function () {
    // given
    const input = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }

    //when 
    const response = await axios.post("http://localhost:3000/signup", input);
    //then
    const outputSignup = response.data;

    expect(outputSignup.accountId).toBeDefined();

    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;

    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
})

test("Deve solicitar uma corrida", async function () {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }

    //when 
    const response = await axios.post("http://localhost:3000/signup", inputSignup);
    //then
    const outputSignup = response.data;

    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }

    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);

    const outputRequestRide = responseRequestRide.data;
    expect(outputRequestRide.rideId).toBeDefined();
    const responseGetRide = await axios.get(`http://localhost:3000/rides/${outputRequestRide.rideId}`);
    const outputGetRide = responseGetRide.data;
    expect(outputRequestRide.status).toBe(200);
    expect(outputRequestRide.passengetName).toBe("John Doe");
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.fromLat).toBe(-27.584905257808835);
    expect(outputGetRide.status).toBe("requested");
    expect(outputGetRide.date).toBeDefined();
})

test("Não deve solicitar uma corrida se não for passageiro", async function () {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        carPlate: "AAA9999",
        isPassenger: false,
        isDriver: true
    }
    //when 
    const response = await axios.post("http://localhost:3000/signup", inputSignup);
    //then
    const outputSignup = response.data;


    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        fromLong: -48.545022195325124,
        toLat: -27.496887588317275,
        toLong: -48.522234807851476
    }

    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const outputRequestRide = responseRequestRide.data;
    expect(responseRequestRide.status).toBe(422);
    expect(outputRequestRide.message).toBe("Account is not from a passenger");
})


test("Não deve solicitar uma corrida se o passageiro tiver outra corrida com outra corrida ativa", async function () {
    // given
    const inputSignup = {
        name: "John Doe",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "97456321558",
        isPassenger: true
    }
    //when 
    const response = await axios.post("http://localhost:3000/signup", inputSignup);
    //then
    const outputSignup = response.data;

    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -27.584905257808835,
        toLat: -27.496887588317275,
        fromLong: -48.545022195325124,
        toLong: -48.522234807851476
    }
    await axios.post("http://localhost:3000/request_ride", inputRequestRide);

    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const outputRequestRide = responseRequestRide.data;
    expect(responseRequestRide.status).toBe(422);
    expect(outputRequestRide.message).toBe("Passenger has an active ride");
})