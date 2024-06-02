import  {Router} from "express";
import { login, logout, registeruser } from "../controllers/user.controller";
const router:Router=Router();
router.route('/register').post(registeruser);
router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;

