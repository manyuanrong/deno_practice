const { MONGODB_URI } = Deno.env();

export const CONFIG_MONGODB_URI = MONGODB_URI || "mongodb://127.0.0.1:27017";
