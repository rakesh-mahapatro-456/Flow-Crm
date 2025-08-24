import {Router} from 'express';
import {authMiddleware} from '../middlewares/auth.middleware.js';
import wrapAsync from '../middlewares/wrapAsync.middleware.js';
import{signup,login,getUser,logout} from "../controllers/user.controllers.js"

const router  = Router();

router.post("/signup",wrapAsync(signup));
router.post("/login",wrapAsync(login));
router.get("/get-user",authMiddleware,wrapAsync(getUser));
router.get("/logout",wrapAsync(logout));

export default router;