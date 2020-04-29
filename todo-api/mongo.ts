import { CONFIG_MONGODB_URI } from "./config.ts";
import { initMongoModule, MongoClient } from "./deps.ts";

await initMongoModule();

const mongo = new MongoClient();
const db = mongo.database("todo");

export { db };
export async function connectMongodb() {
  mongo.connectWithUri(CONFIG_MONGODB_URI);
}
