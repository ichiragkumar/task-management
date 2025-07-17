import { createClient } from "redis";


const redisClient = createClient({
    url : process.env.REDIS_URL!,
});

export const connectToRedisClient = async () => {

    redisClient.on("error", (error) =>{
    console.log("Redis Client Error", error)
    })


    await redisClient.connect();
}

