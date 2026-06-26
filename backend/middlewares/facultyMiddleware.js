import { User } from "../models/User.js";

export const facultyMiddleware = async (req, res, next) => {
  try {
    // Get user from DB using ID stored in `req.user` (set by authMiddleware)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is a Faculty
    if (user.role !== "Faculty") {
      return res.status(403).json({ message: "Access Denied: Faculty Only" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
