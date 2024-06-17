import express from "express";
import serverconfig from "./config/serverconfig";

import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes";
import expenseRouter from "./routes/expense.routes";
import busgetrouter from "./routes/Budget.routes";

import connectDatabase from "./config/databaseconfig";
import { Iuser } from "./models/User.model";
import budgetrouter from "./routes/Budget.routes";

const app = express();
app.use(cors({
  origin:"https://expense-manager-frontend-nine.vercel.app",
  credentials:true
}));
app.use(cookieParser());

app.use(express.json());

connectDatabase();

app.use("/user", userRouter);
app.use("/expense", expenseRouter);
app.use("/budget", budgetrouter);

app.listen(serverconfig.PORT, () => {
  console.log(`server is running on port :${serverconfig.PORT}`);
});
