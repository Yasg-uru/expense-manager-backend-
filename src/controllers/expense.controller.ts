import Expense from "../models/Expense.model";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import catchAsync from "../middleware/catchasyn.middleware";
import Errorhandler from "../utils/ErrorHandler";
import { RequestWithUser } from "../middleware/Auth.middleware";
// import { Requestwithuser } from "../types/RequestWithUser ";
import { YearlyExpenseReport } from "../types/yearlyExpense";
export const createExpense = catchAsync(
  async (req: RequestWithUser, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new Errorhandler(
          400,
          "Validation failed: " +
            errors
              .array()
              .map((error) => error.msg)
              .join(", ")
        );
      }
      const userid = req.user?._id;

      const { amount, category, date, description, recurring, currency } =
        req.body;
      const expense = await Expense.create({
        userId: userid,
        amount,
        category,
        date,
        description,
        recurring,
        currency,
      });
      res.status(200).json({
        success: true,
        message: "expense created ",
        expense,
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: "Internal server error ",
      });
    }
  }
);
export const getTotalexpense = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = req.user?._id;
      const { year } = req.body;

      if (!user) {
        return next(new Errorhandler(404, "please login to continue "));
      }

      const startDate = new Date(year, 0, 1); // Start of the year
      const endDate = new Date(year, 11, 31); // End of the year

      const expenses = await Expense.find({
        userId: user,
        date: { $gte: startDate, $lte: endDate },
      });
      let totalAmount: number = 0;

      expenses.forEach((expense) => {
        totalAmount += expense.amount;
      });
      res.status(200).json({
        success: true,
        message: "fetched your total expense ",
        Amount: totalAmount,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server error"));
    }
  }
);
// export const getexpenseofprevousweek = catchAsync(
//   async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//       const userid = req.user?._id;

//       const currentdate: Date = new Date();
//       const startofpreviousweek = new Date(
//         currentdate.getFullYear(),
//         currentdate.getMonth(),
//         currentdate.getDay() - 7
//       );
//       const endofpreviousweek = new Date(
//         currentdate.getFullYear(),
//         currentdate.getMonth(),
//         currentdate.getDay() - 1
//       );
//       const expenses = await Expense.find({
//         userId: userid,
//         date: { $gte: startofpreviousweek, $lte: endofpreviousweek },
//       });
//       if (!expenses) {
//         return next(new Errorhandler(404, "expense not found "));
//       }
//       let Toatlexpense: number = 0;

//       const expense_category: any = {};
//       expenses.forEach((expense) => {
//         if (!expense_category[expense.category]) {
//           expense_category[expense.category] = expense.amount;
//         } else {
//           expense_category[expense.category] += expense.amount;
//         }
//         Toatlexpense += expense.amount;
//       });
//       res.status(200).json({
//         success: true,

//         message: "fetched your previous week expense ",
//         category: expense_category,
//         Toatlexpense,
//         expenses,
//       });
//     } catch (error) {
//       return next(new Errorhandler(500, "Internal server error"));
//     }
//   }
// );
export const getExpenseByWeek = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const currentdate = new Date();

      const selectedWeekString = req.query.week?.toString();
      if (!selectedWeekString) {
        return next(new Errorhandler(400, "Missing 'week' query parameter."));
      }

      const selectedWeek = parseInt(selectedWeekString, 10);
      if (!selectedWeek || selectedWeek < 1 || selectedWeek > 3) {
        return next(
          new Errorhandler(400, "Invalid week selection. Choose 1, 2, or 3.")
        );
      }

      const offsetWeeks = selectedWeek - 1; // Calculate offset based on selected week

      const startofWeek = new Date(
        currentdate.getFullYear(),
        currentdate.getMonth(),
        currentdate.getDate() - (currentdate.getDay() || 7) - offsetWeeks * 7
      );
      startofWeek.setHours(0, 0, 0, 0); // Set start of week to midnight

      const endofWeek = new Date(startofWeek.getTime());
      endofWeek.setDate(endofWeek.getDate() + 6); // Set end of week to next Saturday night
      endofWeek.setHours(23, 59, 59, 999); // Set end of week to 11:59pm on Saturday

      const expenses = await Expense.find({
        userId,
        date: { $gte: startofWeek, $lte: endofWeek },
      });

      if (!expenses || expenses.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No expenses found for the selected week.",
          category: {},
          Toatlexpense: 0,
          expenses: [],
        });
      }

      let totalExpense = 0;
      const expenseCategory: { [key: string]: number } = {};

      expenses.forEach((expense) => {
        if (!expenseCategory[expense.category]) {
          expenseCategory[expense.category] = expense.amount;
        } else {
          expenseCategory[expense.category] += expense.amount;
        }
        totalExpense += expense.amount;
      });

      res.status(200).json({
        success: true,
        message: `Fetched your expenses for the previous ${selectedWeek} week(s).`,
        category: expenseCategory,
        totalExpense,
        expenses,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server error"));
    }
  }
);

export const getexpensebymonth = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { year, month } = req.body;
      //validation for years and month
      if (!year || !month || month < 1 || month > 12) {
        return next(new Errorhandler(404, "Invalid Month or Year"));
      }
      const userid = req.user?._id;

      const startdateofmonth = new Date(year, month - 1, 1);
      const enddateofmonth = new Date(year, month, 0);
      const expenses = await Expense.find({
        userId: userid,
        date: { $gte: startdateofmonth, $lte: enddateofmonth },
      });
      if (!expenses) {
        return next(new Errorhandler(404, "expense not found "));
      }
      const expense_category: any = {};
      let totalexpense: number = 0;

      expenses.forEach((expense) => {
        if (!expense_category[expense.category]) {
          expense_category[expense.category] = expense.amount;
        } else {
          expense_category[expense.category] += expense.amount;
        }
        totalexpense += expense.amount;
      });
      res.status(200).json({
        success: true,
        message: "fetched your monthly expense ",
        totalexpense,
        expense_category,
        expenses,
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server Error"));
    }
  }
);
export const getfullyearreport = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { year } = req.body;
      if (!year) {
        return next(new Errorhandler(404, "invalid year"));
      }
      let totalexpense = 0;
      const yearlyExpensesByCategory: any = {};
      const userId = req.user?._id;

      // Iterate over each month of the year
      for (let month = 0; month < 12; month++) {
        // Calculate the start and end dates for the current month
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        // Find all expenses for the user within the current month
        const expenses = await Expense.find({
          userId,
          date: { $gte: startDate, $lte: endDate },
        });

        // Calculate total expenses by category for the current month
        expenses.forEach((expense) => {
          if (!yearlyExpensesByCategory[expense.category]) {
            yearlyExpensesByCategory[expense.category] = Array(12).fill(0);
          }
          yearlyExpensesByCategory[expense.category][month] += expense.amount;
          totalexpense += expense.amount;
        });
      }
      res.status(200).json({
        success: true,
        message: "fetched your yearly details",
        yearlyExpensesByCategory,
        totalexpense,
      });
    } catch (error) {
      return next(new Errorhandler(500, "internal server Error"));
    }
  }
);