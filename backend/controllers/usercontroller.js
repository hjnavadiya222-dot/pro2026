import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv"
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

dotenv.config({})
const JWT_SECRET = process.env.JWT_SECRET;



// Student Signup
export const registerStudent = async (req, res) => {
  try {

    // console.log("divy");
    const { fullname, email, password, department, semester, phoneNumber } = req.body;

    // console.log(fullname, email, password, department, phoneNumber)

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new User({
      userId: Date.now().toString(),
      fullname,
      email,
      password: hashedPassword,
      semester,
      role: "Student", // Default role for signup
      department,
      phoneNumber
    });

    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error registering student", error });
  }
};

// Admin Adding Faculty

export const addFaculty = async (req, res) => {
  try {
    const { fullname, email, password, department, phoneNumber, subject } = req.body; // ✅ Added subject

    // Check if requester is admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can add faculty!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    if (!subject || !Array.isArray(subject) || subject.length === 0) {
      return res.status(400).json({ message: "Faculty must have at least one subject" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFaculty = new User({
      userId: Date.now().toString(),
      fullname,
      email,
      password: hashedPassword,
      role: "Faculty", // Faculty role assigned by Admin
      department,
      phoneNumber,
      subject, // ✅ Added subject field
    });

    await newFaculty.save();
    res.status(201).json({ message: "Faculty added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding faculty", error });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    // Set token in HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful!", user });

  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Ensure secure in production
      path: "/", // Clears cookie for entire domain
    });

    res.status(200).json({ message: "Logout successful!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error: error.message });
  }
};




export const updateProfile = async (req, res) => {
  try {
    const { fullname, phoneNumber, semester, department, designation, qualification, experience, portfolio, subject } = req.body;

    const userId = req.params.id; // Get user ID from URL
    const file = req.file; // Fix: Use req.file (not req.files)

    // Find the user
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle Profile Picture Upload
    if (file) {
      // Convert file buffer to data URIj
      const fileUri = getDataUri(file);

      // Upload new profile picture to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
        folder: "profile_pictures",
      });

      // Delete old profile picture from Cloudinary if it exists
      if (user.profile.profilePicture?.public_id) {
        await cloudinary.uploader.destroy(user.profile.profilePicture.public_id);
      }

      // Update user's profile picture
      user.profile.profilePicture = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // Update other profile details
    if (fullname) user.fullname = fullname;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (department) user.department = department;
    if (semester !== undefined && user.role === "Student") {
      user.semester = semester;
    }

    // Update faculty-specific fields if user is Faculty
    if (user.role === "Faculty") {
      if (designation) user.designation = designation;
      if (qualification !== undefined) user.qualification = qualification;
      if (experience !== undefined) user.experience = experience;
      if (portfolio !== undefined) user.portfolio = portfolio;
      
      if (subject) {
        let parsedSubjects = subject;
        if (typeof parsedSubjects === "string") {
          try {
            parsedSubjects = JSON.parse(parsedSubjects);
          } catch (e) {
            parsedSubjects = parsedSubjects.split(",").map(s => s.trim()).filter(Boolean);
          }
        }
        if (Array.isArray(parsedSubjects)) {
          if (parsedSubjects.length === 0) {
            return res.status(400).json({ message: "At least one subject is required for faculty." });
          }
          user.subject = parsedSubjects;
        }
      }
    }

    // Save updated user details
    await user.save();

    // Format response (remove sensitive data)
    const updatedUser = {
      _id: user._id,
      userId: user.userId,
      fullname: user.fullname,
      email: user.email,
      profile: user.profile,
      phoneNumber: user.phoneNumber,
      department: user.department,
      role: user.role,
      semester: user.semester,
      subject: user.subject,
      designation: user.designation,
      qualification: user.qualification,
      experience: user.experience,
      portfolio: user.portfolio,
    };

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Controller to get faculty by subject
export const getFacultyBySubject = async (req, res) => {
  try {
    const { subject } = req.query; // Use req.query instead of req.body for query parameters

    // Check if subject is provided
    if (!subject) {
      return res.status(400).json({ message: "Subject is required" });
    }

    // Fetch all faculty members who teach the selected subject
    const faculty = await User.find({
      role: "Faculty",
      subject: { $in: [subject] } // Find faculty who teach the selected subject
    });

    if (faculty.length === 0) {
      return res.status(404).json({ message: "No faculty found for this subject" });
    }

    // Return the list of faculty members as an array
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Error fetching faculty", error });
  }
};
export const getAllFaculty = async (req, res) => {
  try {
    // Fetch all users with the role 'Faculty'
    const faculty = await User.find({ role: "Faculty" });

    // If no faculty found
    if (faculty.length === 0) {
      return res.status(404).json({ message: "No faculty found" });
    }

    // Return the list of faculty
    res.status(200).json(faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: "Error fetching faculty", error });
  }
};



export const getAllSub = async (req, res) => {
  try {
    const sem = req.query.semester;

    const subjectsBySemester = {
      3: [
        "Principles of Economics and Management (BTAS10301)",
        "Computer Organization and Architecture (BTCO13302)",
        "Microprocessor and Interfacing (BTCO13303)",
        "Object Oriented Programming (BTCO13304)",
        "Discrete Mathematics (BTIT13301)",
        "Data Structures (BTIT13302)",
        "Essence of Indian Traditional Knowledge (BTMD17301)"
      ],
      4: [
        "Entrepreneurship and Start-up (BTAS10401)",
        "Probability and Statistics (BTAS11402)",
        "Computer Networks (BTCO13401)",
        "Operating Systems (BTCO13402)",
        "Design and Analysis of Algorithms (BTCO13403)",
        "Database Management Systems (BTCO13404)"
      ],
      5: [
        "Engineering Optimization (BTAS10501)",
        "Web Technologies (BTCO13502)",
        "Data Mining and Business Intelligence (BTIT13501)",
        "Cryptography and Network Security (BTIT13502)",
        "Software Engineering (BTIT14501)",
        "Cloud Computing (BTIT14502)",
        "Cyber Physical Systems (BTIT14503)",
        "Information and Communication Technology in Agriculture (BTIT14504)",
        "Data Science using Python (BTIT15501)",
        "Programming with Java (BTIT15502)"
      ],
      6: [
        "Data Analysis and Visualization (BTIT13601)",
        "Artificial Intelligence and Applications (BTIT13602)",
        "E-Commerce and E-Business Management (BTIT13603)",
        "Computer Graphics (BTIT14601)",
        "Mobile Application Development (BTIT14602)",
        "Advanced Web Technology (BTIT14603)",
        "NoSQL Databases (BTIT14604)",
        "Computer Vision (BTIT14605)",
        "DotNet Technology (BTIT14606)",
        "Machine Learning Techniques (BTIT14607)",
        "Data Compression (BTIT14608)",
        "Introduction to Artificial Intelligence (BTIT15601)",
        "Information Security (BTIT15602)",
        "Research & Innovation (BTMD17608)"
      ],
      7: [
        "Automata Theory and Compiler Design (BTIT13701)",
        "Distributed Systems (BTIT13702)",
        "Agile Development and UX Design (BTIT14701)",
        "Blockchain Technology and Applications (BTIT14702)",
        "Software Testing (BTIT14703)",
        "IOT and Applications (BTIT14704)",
        "Wireless Communications (BTIT14705)",
        "Natural Language Processing (BTIT14706)",
        "Secure Software Engineering (BTIT14707)",
        "Advanced Database Systems (BTIT14708)",
        "Fundamentals of Blockchain Technology (BTIT15701)",
        "Introduction to Machine Learning (BTIT15702)",
        "Project-I (BTIT16701)",
        "Indian Constitution (BTMD17701)"
      ],
      8: [
        "Project-II/ Internship (BTIT16801)",
        "Business Ethics and Corporate Responsibilities (BTMD17801)"
      ]
    };

    let allSub = [];
    if (sem && subjectsBySemester[sem]) {
      allSub = subjectsBySemester[sem];
    } else {
      // If no semester is provided, return all subjects
      allSub = [
        ...(subjectsBySemester[3] || []), 
        ...(subjectsBySemester[4] || []),
        ...(subjectsBySemester[5] || []),
        ...(subjectsBySemester[6] || []),
        ...(subjectsBySemester[7] || []),
        ...(subjectsBySemester[8] || [])
      ];
    }

    res.json({ allSub, success: true });

  } catch (error) {
    console.log(error);
  }
}

// Delete Faculty
export const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if requester is admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Only admins can delete faculty!" });
    }

    const faculty = await User.findById(id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty member not found" });
    }

    if (faculty.role !== "Faculty") {
      return res.status(400).json({ message: "Can only delete faculty members" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ message: "Error deleting faculty", error: error.message });
  }
};

export const registerFaculty = async (req, res) => {
  try {
    const { fullname, email, password, designation, department } = req.body;

    if (!fullname || !email || !password || !designation || !department) {
      return res.status(400).json({ message: "All fields are required.", success: false });
    }

    // Email Validation: Only allow faculty emails from @scet.ac.in
    const emailRegex = /^[a-zA-Z0-9._%+-]+@scet\.ac\.in$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Only official faculty emails from @scet.ac.in are allowed!", success: false });
    }

    // Faculty Verification:
    // 1. If email does not exist in Faculty Directory (User table with role Faculty), deny registration.
    const faculty = await User.findOne({ email, role: "Faculty" });
    if (!faculty) {
      return res.status(400).json({ message: "Email is not listed in the Faculty Directory. Please contact the administrator.", success: false });
    }

    // 2. Prevent duplicate faculty accounts.
    if (faculty.isRegistered) {
      return res.status(400).json({ message: "Faculty account has already been registered.", success: false });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the existing seeded faculty record
    faculty.fullname = fullname;
    faculty.password = hashedPassword;
    faculty.designation = designation;
    faculty.department = department;
    faculty.isRegistered = true;

    await faculty.save();

    res.status(200).json({ message: "Faculty registered successfully!", success: true });
  } catch (error) {
    console.error("Error registering faculty:", error);
    res.status(500).json({ message: "Error registering faculty", error: error.message, success: false });
  }
};
