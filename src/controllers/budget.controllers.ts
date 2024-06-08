import Budget from "../models/Budget.model";
import catchAsync from "../middleware/catchasyn.middleware";
import { RequestWithUser } from "../middleware/Auth.middleware";
import { NextFunction, Response, Request } from "express";
import Errorhandler from "../utils/ErrorHandler";

import { ExpenseQuery, BudgetQuery } from "../types/categorytypes";
import Expense from "../models/Expense.model";

export const createbudget = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const existingbudget = await Budget.find(req.body);
      if (existingbudget.length !== 0) {
        return next(
          new Errorhandler(
            400,
            "Budget already exists for this category and month you can update it now "
          )
        );
      }
      const budget = await Budget.create({
        userId,
        ...req.body,
      });
      res.status(200).json({
        success: true,
        message: "created your budget successfully",
        budget,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server Error"));
    }
  }
);
export const updatebudget = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const updates = req.body;

      const updatedBudget = await Budget.findByIdAndUpdate(id, updates, {
        new: true, // return the updated document
      });
      if (!updatedBudget) {
        return res.status(404).json({ message: "Budget not found" });
      }
      res.status(200).json({
        success: true,
        message: "updated successfully",
        updatebudget,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server Error "));
    }
  }
);
// export const getBudget = catchAsync(
//   async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//       const userId = req.user?._id;
//       const { month, year } = req.query;
//       const budget = await Budget.findOne({ userId, month, year });
//       if (!budget) {
//         return next(new Errorhandler(404, "Budget not found"));
//       }
//       res.status(200).json({
//         success: true,
//         budget,
//       });
//     } catch (error) {
//       return next(new Errorhandler(500, "Internal server error"));
//     }
//   }
// );

export const deletebudget = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      let budget = await Budget.findById(id);
      if (!budget) {
        return next(new Errorhandler(404, "your budget not found "));
      }
      budget = await Budget.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "your budget deleted successfully",
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server Error"));
    }
  }
);

export const generatemonthlyReport = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const { month, year, category } = req.body;
      let budgetquery: BudgetQuery = { userId, month, year, category };
      let expensequery: ExpenseQuery = {
        userId,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lte: new Date(year, month, 0),
        },
        category,
      };
      console.log(`this is budget querry:`, budgetquery);
      console.log(`this is expense query:`, expensequery);

      const expenses = await Expense.find(expensequery);
      const budgets = await Budget.findOne(budgetquery);
      console.log(`this is expenses :`, expenses);
      console.log(`this is budgets:`, budgets);
      if (!budgets || !expenses) {
        return next(
          new Errorhandler(404, "expense or budget is not exist for this query")
        );
      }
      let budgetlimit: number = budgets.limit;

      let totalexpense: number = 0;
      const expensebycategory: { [key: string]: number } = {};

      expenses.forEach((expense) => {
        totalexpense += expense.amount;
        if (!expensebycategory[expense.category]) {
          expensebycategory[expense.category] = expense.amount;
        } else {
          expensebycategory[expense.category] += expense.amount;
        }
      });
      const percentageUsage = (totalexpense / budgetlimit) * 100;

      res.status(200).json({
        success: true,
        message: "successfully",
        budgetlimit,
        expensebycategory,
        remainingbudget: budgetlimit - totalexpense,
        percentageUsage,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server Error"));
    }
  }
);
export const Getyourbudgets = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const page = req.query.page;

      if (!page) {
        return next(new Errorhandler(404, "page not found please enter page "));
      }
      const pagenumber = parseInt(page.toString() || "1");
      const skip = (pagenumber - 1) * 10;
      // we have limit of 10 documents only
      const Budgets = await Budget.find({ userId }).limit(10).skip(skip);
      if (!Budgets) {
        return next(new Errorhandler(404, "budgets not found "));
      }
      const countofBudgets = await Budget.countDocuments({ userId });

      const Totalpages = countofBudgets / 10;
      res.status(200).json({
        success: true,
        message: "Fetched your budgets successfully",
        Budgets,
        Totalpages,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal Server Error"));
    }
  }
);
