import express from "express"
import cors from "cors"
import projectRouter from "./routes/projects"
import accountRouter from "./routes/users"
import adminRouter from "./routes/admin";
import { connectToKafkaProducer } from "./kafka/producer";
import { connectToRedisClient } from "./redis/redisClient";

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/users", accountRouter)
app.use("/api/v1/admin", adminRouter)


connectToKafkaProducer()
connectToRedisClient()

app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
}); 


