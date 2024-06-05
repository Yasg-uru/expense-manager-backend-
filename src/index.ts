import express from "express";
import serverconfig from "./config/serverconfig";

import cookieParser from "cookie-parser";
import cors from 'cors';
import userRouter from "./routes/user.routes";
import expenseRouter from "./routes/expense.routes";
import connectDatabase from "./config/databaseconfig";
import { Iuser } from './models/User.model';


const app=express();
app.use(cors());
app.use(cookieParser());


app.use(express.json());

connectDatabase();

app.use("/user",userRouter);
app.use("/expense",expenseRouter);


app.listen(serverconfig.PORT,()=>{
    console.log(`server is running on port :${serverconfig.PORT}`);
});