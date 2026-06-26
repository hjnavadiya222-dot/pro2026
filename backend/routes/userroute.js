import express from "express";
import { registerStudent, addFaculty, loginUser, logoutUser, updateProfile, getFacultyBySubject, getAllSub, getAllFaculty, deleteFaculty } from "../controllers/usercontroller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Student Signup

router.route("/signup").post(registerStudent);
// console.log("vinit");

// Admin Adds Faculty (Requires Admin Auth)
router.route("/add-faculty").post(authMiddleware, adminMiddleware, addFaculty);

// Delete Faculty (Requires Admin Auth)
router.route("/delete-faculty/:id").delete(authMiddleware, adminMiddleware, deleteFaculty);

// User Login
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

// Get User Profile
router.route("/profile/:id").post(authMiddleware, singleUpload("profilePicture"), updateProfile);


router.route("/faculty").get(getFacultyBySubject);

router.route("/subjects").get(getAllSub);

router.route("/faculty/all").get(getAllFaculty);
export default router;
