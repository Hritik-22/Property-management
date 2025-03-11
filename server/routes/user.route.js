import express from "express";
import {
  deleteUser,
  updateUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/update/:id", updateUser); //Update User
router.delete("/delete/:id", deleteUser); //Delete User
router.get("/listings/:id", getUserListings); //User Listing
router.get("/:id", verifyToken, getUser); //Get User

export default router;
