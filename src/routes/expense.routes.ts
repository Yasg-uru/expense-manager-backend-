import { Router } from "express";
import {
  createExpense,
  getTotalexpense,
  getexpensebymonth,
  getExpenseByWeek,
  getfullyearreport,
  getweeklyExpenseReportforGraph,
  Get_Expense_monthly_Graph,
} from "../controllers/expense.controller";
import { isAuthenticated } from "../middleware/Auth.middleware";

const router = Router();

router.post("/create", isAuthenticated, createExpense);
router.get("/prevweek", isAuthenticated, getExpenseByWeek);
router.get("/prevweekreport", isAuthenticated, getweeklyExpenseReportforGraph);

router.get("/monthly", isAuthenticated, getexpensebymonth);
router.get("/monthly_graph",isAuthenticated,Get_Expense_monthly_Graph);

router.get("/report", isAuthenticated, getfullyearreport);

export default router;
