import express from "express"
import cors from "cors"
import userRouter from "./routes/user"
import { connectToKafkaProducer } from "./kafka/producer";

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/v1/user", userRouter)


connectToKafkaProducer()

app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
}); 


