import mongoose, { Schema, Document } from "mongoose";

interface IBudget extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  category: string;
  limit: number;
  month: number;
  year: number;
  alertThreshold: number;
  actualSpent: number;
}

const BudgetSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  limit: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  alertThreshold: { type: Number, default: 0.9 },
  actualSpent: { type: Number, default: 0 },
});

export default mongoose.model<IBudget>("Budget", BudgetSchema);
