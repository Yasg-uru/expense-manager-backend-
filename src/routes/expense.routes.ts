import {  Router } from "express";
import { createExpense, getTotalexpense,getexpensebymonth,getExpenseByWeek, getfullyearreport } from "../controllers/expense.controller";
import { isAuthenticated } from "../middleware/Auth.middleware";

const router = Router();

router.post('/create',isAuthenticated,createExpense);
router.get('/prevweek',isAuthenticated,getExpenseByWeek);
router.get('/monthly',isAuthenticated,getexpensebymonth);
router.get('/report',isAuthenticated,getfullyearreport);



export default router;
