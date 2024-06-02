import  { Schema, model } from "mongoose";
import validator from "validator";

export interface Iuser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  profileurl: string;
}
const userschema = new Schema<Iuser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: "please Enter correct format of Email",
    },
  },
  password: {
    type: String,
    required: true,
    // minlength: ["please enter password greater than length 5"],
    // maxlength: 20,
  },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["user", "admin"],
  },
  profileurl: {
    type: String,
  },
});

const usermodel=model("User",userschema);
export default usermodel;
