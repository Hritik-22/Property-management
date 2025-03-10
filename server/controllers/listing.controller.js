import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

//Create Listing
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

//Delete Listing
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

//Update Listing
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }
  //Check Authenticate User
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update your own listings!"));
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
//Get Listing
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
//Search Functionality
export const getListings = async (req, res, next) => {
  try {
    // Convert query parameters
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Handle boolean filters properly
    const offer = req.query.offer ? req.query.offer === "true" : undefined;
    const furnished = req.query.furnished ? req.query.furnished === "true" : undefined;
    const parking = req.query.parking ? req.query.parking === "true" : undefined;

    // Handle type filtering
    const type = req.query.type && req.query.type !== "all" ? req.query.type : undefined;

    // Search term logic
    const searchTerm = req.query.searchTerm ? req.query.searchTerm.trim() : "";

    // Sorting order
    const sortField = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1; // Convert to numerical value

    // Construct query object dynamically
    let query = {};

    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { address: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } }
      ];
    }

    if (offer !== undefined) query.offer = offer;
    if (furnished !== undefined) query.furnished = furnished;
    if (parking !== undefined) query.parking = parking;
    if (type) query.type = type;

    // Fetch listings from MongoDB
    const listings = await Listing.find(query)
      .sort({ [sortField]: order })
      .limit(limit)
      .skip(startIndex);

    // Return results (even empty arrays)
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

