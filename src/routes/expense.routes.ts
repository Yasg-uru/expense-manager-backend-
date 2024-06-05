import {  Router } from "express";
import { createExpense, getTotalexpense,getexpensebymonth,getexpenseofprevousweek, getfullyearreport } from "../controllers/expense.controller";
import { isAuthenticated } from "../middleware/Auth.middleware";

const router = Router();

router.post('/create',isAuthenticated,createExpense);
router.get('/totalexpenseyearly',isAuthenticated,getfullyearreport);
router.get('/monthly',isAuthenticated,getexpensebymonth);

router.get('/prevweek',isAuthenticated,getexpenseofprevousweek);


export default router;
