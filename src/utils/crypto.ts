import crypto from "crypto";

export default function generateId(){
    return crypto.randomUUID();
}