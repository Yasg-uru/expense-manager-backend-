import { Router } from "express";
import { isAuthenticated } from "../middleware/Auth.middleware";
import { Getyourbudgets, createbudget, deletebudget, generatemonthlyReport, updatebudget } from "../controllers/budget.controllers";
const budgetrouter = Router();
budgetrouter.post('/create',isAuthenticated,createbudget);
budgetrouter.put('/update/:id',isAuthenticated,updatebudget);
budgetrouter.delete('/delete/:id',isAuthenticated,deletebudget);
budgetrouter.get('/monthly',isAuthenticated,generatemonthlyReport);
budgetrouter.get('/Budgets',isAuthenticated,Getyourbudgets);



export default budgetrouter;
