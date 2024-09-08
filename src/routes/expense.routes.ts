import { Router } from "express";
import {
  createExpense,
  getTotalexpense,
  getexpensebymonth,
  getExpenseByWeek,
  getFullyearReport,
  getweeklyExpenseReportforGraph,
  Get_Expense_monthly_Graph,
  GetExpensesByDay,
} from "../controllers/expense.controller";
import { isAuthenticated } from "../middleware/Auth.middleware";

const router = Router();

router.post("/create", isAuthenticated, createExpense);
router.get("/prevweek", isAuthenticated, getExpenseByWeek);
router.get("/prevweekreport", isAuthenticated, getweeklyExpenseReportforGraph);

router.get("/monthly", isAuthenticated, getexpensebymonth);
router.get("/monthly_graph",isAuthenticated,Get_Expense_monthly_Graph);
router.get('/get-daily/:date',isAuthenticated,GetExpensesByDay);

router.get("/report", isAuthenticated, getFullyearReport);

export default router;
