import { Schema, model, Document } from "mongoose";
interface Expense extends Document {
  userId: Schema.Types.ObjectId; // Reference to the User document
  amount: number;
  category: string;
  date: Date;
  description?: string; // Optional property
  recurring: boolean;
  currency: string;
}
const expenseSchema = new Schema<Expense & Document>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  recurring: { type: Boolean, default: false },
  currency: { type: String},
});
const expensemodel = model("Expense", expenseSchema);
export default expensemodel;
