import { Router } from "express";
import { getLoginPage, getLogout, getRegisterPage, postLoginPage, postRegisterPage } from "../controllers/auth.controller.js";
import { getAboutPage, getMe } from "../controllers/page.controller.js";
import { protect } from "../middleware/protect.middleware.js";
const router = Router()

router.get('/register', getRegisterPage)
router.post('/register', postRegisterPage)
router.get('/login', getLoginPage)
router.post('/login', postLoginPage)
router.get('/about', getAboutPage)
router.get('/me',protect, getMe)
router.get('/logout', getLogout );


// router.route("/login").get(getLoginPage).post(postLoginPage)

export const authRoutes = router
