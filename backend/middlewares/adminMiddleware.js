import { User } from "../models/User.js";

// Admin Middleware: Restrict Access to Admins Only
export const adminMiddleware = async (req, res, next) => {
  try {
    // Fetch user from DB using the ID from the token
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an Admin
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Access Denied: Admins Only" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
