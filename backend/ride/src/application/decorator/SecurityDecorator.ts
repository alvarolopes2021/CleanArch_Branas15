import UseCase from "../usecase/UseCase";

export default class SecurityDecorator implements UseCase {

    constructor(readonly useCase: UseCase) {

    }

    execute(input: any): Promise<any> {
        console.log("validaitng user security token");
        return this.useCase.execute(input);
    }

}