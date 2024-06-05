interface YearlyExpensesByCategory {
    [category: string]: number[]; // An array of expenses for each month (January to December)
  }
  
export interface YearlyExpenseReport {
    [year: number]: YearlyExpensesByCategory; // Year-wise expenses by category
  }
  