
import crypto from 'crypto';
import CarPlate from '../vo/CarPlate';
import Cpf from '../vo/Cpf';
import Email from '../vo/Email';
import Name from '../vo/Name';

export default class Account {
    private name: Name;
    private email: Email;
    private cpf: Cpf;
    private carPlate?: CarPlate;

    constructor(
        readonly accountId: string,
        name: string,
        email: string,
        cpf: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean,
        carPlate?: string) {

        this.name = new Name(name);
        this.email = new Email(email);
        this.cpf = new Cpf(cpf);

        if (isDriver && carPlate) this.carPlate = new CarPlate(carPlate);

    }

    static create(name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate?: string) {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate);
    }

    static restore(accountId: string, name: string, email: string, cpf: string, isPassenger: boolean, isDriver: boolean, carPlate?: string) {
        return new Account(accountId, name, email, cpf, isPassenger, isDriver, carPlate,);
    }


    setName(name: string) {
        this.name = new Name(name);
    }

    getName() {
        return this.name.getValue();
    }


    setEmail(email: string) {
        this.email = new Email(email);
    }
    getEmail() {
        return this.email.getValue();
    }

    getCpf() {
        return this.cpf.getValue();
    }

    getCarPlate(){
        return this.carPlate?.getValue();
    }
}