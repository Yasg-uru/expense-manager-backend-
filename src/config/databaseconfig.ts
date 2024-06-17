import mongoose from "mongoose";
const uri: string = "mongodb://127.0.0.1:27017/expense-manager";

async function connectDatabase() {
  try {
    const response = await mongoose.connect(process.env.MONGO_URL as string);
    console.log(`database is connected with :${response.connection.host}`);
  } catch (error) {
    console.log(`failed to connect with database !`);
    process.exit(1);
  }
}
export default connectDatabase;
