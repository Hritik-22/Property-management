import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createListing); //Create Listings
router.delete("/delete/:id", deleteListing); //Delete Listings
router.post("/update/:id", updateListing); //Update Listings
router.get("/get/:id", getListing); //Get Single Listing
router.get("/get", getListings); //Get Listings

export default router;
