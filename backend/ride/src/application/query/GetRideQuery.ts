import DatabaseConnection from "../../infra/database/DatabaseConnection";

export default class GetRideQuery {

    constructor(readonly connection : DatabaseConnection){

    }

    async execute (rideId: string){
        const data = await this.connection.query(`
            select 
                r.ride_id,
                r.status,
                r.date,
                r.distance,
                p.name as passenger_name,
                p.email as passenger_email,
                d.name as driver_name,
                d.email as driver_email
            from
                cccat15.ride r 
                join cccat15.account on (r.passenger_id = p.account_id)
                left join cccat15.account d (r.driver_d = d.account_id)
            where
                r.ride_id = $1
        
        `, [rideId]);
        
        return data;
    }
}