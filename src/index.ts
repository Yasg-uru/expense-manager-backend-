import express from "express";
import serverconfig from "./config/serverconfig";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';
import userRouter from "./routes/user.routes"
import connectDatabase from "./config/databaseconfig";
const app=express();
app.use(cors());
app.use(cookieParser());


app.use(express.json());

connectDatabase();

app.use("/user",userRouter);

app.listen(serverconfig.PORT,()=>{
    console.log(`server is running on port :${serverconfig.PORT}`);
});