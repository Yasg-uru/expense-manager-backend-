import { ObjectId } from "mongoose";
export interface BudgetQuery {
    userId: any ;
    month: any;
    year: any;
    category?: any;
  }
  
  export interface ExpenseQuery {
    userId:any ;
    date: {
      $gte: Date;
      $lte: Date;
    };
    category?: any;
  }