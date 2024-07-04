import DatabaseConnection from "../../infra/database/DatabaseConnection";

export default class GetRideProjectionQuery {

    constructor(readonly connection: DatabaseConnection) {

    }

    async execute(rideId: string) {
        const [data] = await this.connection.query(`
            select 
                *
            from
                cccat15.ride_projection 
            where
                ride_id = $1;
        
        `, [rideId]);

        return data;
    }
}