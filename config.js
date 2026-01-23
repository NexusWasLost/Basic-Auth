import dotenv from "dotenv";

dotenv.config();

export const conf = {

    PORT: process.env.PORT || 3000,
    DB_URL: process.env.REMOTE_DB_URL,
    JWT_KEY: process.env.JWT_SECRET_KEY

}
