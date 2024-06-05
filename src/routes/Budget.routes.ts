import { Router } from "express";
import { isAuthenticated } from "../middleware/Auth.middleware";
import { createbudget, deletebudget, generatemonthlyReport, updatebudget } from "../controllers/budget.controllers";
const budgetrouter = Router();
budgetrouter.post('/create',isAuthenticated,createbudget);
budgetrouter.put('/update',isAuthenticated,updatebudget);
budgetrouter.delete('/delete',isAuthenticated,deletebudget);
budgetrouter.get('/monthly',isAuthenticated,generatemonthlyReport)


export default budgetrouter;
