import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from './models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedFaculty = async () => {
  try {
    const filePath = path.join(__dirname, 'data', 'facultyData.json');
    if (!fs.existsSync(filePath)) {
      console.log("Faculty data file not found at:", filePath);
      return;
    }
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const facultyList = JSON.parse(rawData);

    // Get list of allowed emails and names
    const allowedEmails = facultyList.map(f => f.email).filter(e => e && e !== "Not Available" && e !== "-");
    const allowedNames = facultyList.map(f => f.name);

    // Remove faculty members from database who are not in the JSON file
    const deleteResult = await User.deleteMany({
      role: "Faculty",
      email: { $nin: allowedEmails },
      fullname: { $nin: allowedNames }
    });
    if (deleteResult.deletedCount > 0) {
      console.log(`Deleted ${deleteResult.deletedCount} obsolete faculty members from database.`);
    }

    // Collect all subjects to assign to each faculty member
    const subjects = [
      "Principles of Economics and Management (BTAS10301)",
      "Computer Organization and Architecture (BTCO13302)",
      "Microprocessor and Interfacing (BTCO13303)",
      "Object Oriented Programming (BTCO13304)",
      "Discrete Mathematics (BTIT13301)",
      "Data Structures (BTIT13302)",
      "Essence of Indian Traditional Knowledge (BTMD17301)",
      "Entrepreneurship and Start-up (BTAS10401)",
      "Probability and Statistics (BTAS11402)",
      "Computer Networks (BTCO13401)",
      "Operating Systems (BTCO13402)",
      "Design and Analysis of Algorithms (BTCO13403)",
      "Database Management Systems (BTCO13404)",
      "Engineering Optimization (BTAS10501)",
      "Web Technologies (BTCO13502)",
      "Data Mining and Business Intelligence (BTIT13501)",
      "Cryptography and Network Security (BTIT13502)",
      "Software Engineering (BTIT14501)",
      "Cloud Computing (BTIT14502)",
      "Data Analysis and Visualization (BTIT13601)",
      "Artificial Intelligence and Applications (BTIT13602)",
      "E-Commerce and E-Business Management (BTIT13603)",
      "Computer Graphics (BTIT14601)",
      "Advanced Web Technology (BTIT14603)",
      "NoSQL Databases (BTIT14604)",
      "Machine Learning Techniques (BTIT14607)",
      "Data Compression (BTIT14608)",
      "Research & Innovation (BTMD17608)",
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
      "Indian Constitution (BTMD17701)",
      "Project-II/ Internship (BTIT16801)",
      "Business Ethics and Corporate Responsibilities (BTMD17801)"
    ];

    const hashedPassword = await bcrypt.hash("scet1234", 10);

    for (let i = 0; i < facultyList.length; i++) {
      const fac = facultyList[i];
      let existingUser = null;
      if (fac.email && fac.email !== "Not Available") {
        existingUser = await User.findOne({ email: fac.email });
      } else {
        existingUser = await User.findOne({ fullname: fac.name });
      }

      if (!existingUser) {
        const dbEmail = (fac.email && fac.email !== "Not Available") ? fac.email : "-";

        const newFaculty = new User({
          userId: `seed-${Date.now()}-${i}`,
          fullname: fac.name,
          email: dbEmail,
          password: hashedPassword,
          role: "Faculty",
          department: "Information Technologies",
          phoneNumber: "0000000000",
          subject: subjects,
          designation: fac.designation,
          qualification: fac.qualification,
          experience: fac.experience,
          portfolio: fac.portfolio || "",
          isRegistered: false,
        });

        await newFaculty.save();
        console.log(`Seeded faculty member: ${fac.name}`);
      } else {
        let updated = false;
        if (!existingUser.designation) { existingUser.designation = fac.designation; updated = true; }
        if (!existingUser.qualification) { existingUser.qualification = fac.qualification; updated = true; }
        if (!existingUser.experience) { existingUser.experience = fac.experience; updated = true; }
        if (fac.portfolio && !existingUser.portfolio) { existingUser.portfolio = fac.portfolio; updated = true; }
        
        // Force update subjects for all faculty members to give everyone all subjects
        existingUser.subject = subjects;
        updated = true;

        if (updated) {
          await existingUser.save();
          console.log(`Updated faculty fields: ${fac.name}`);
        }
      }
    }
    console.log("Faculty seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding faculty database:", error);
  }
};

const connectDB = async () => {
    try {
        // Set fallback public DNS servers to resolve MongoDB Atlas SRV URIs (bypasses ISP DNS bugs)
        try {
            dns.setServers(['8.8.8.8', '1.1.1.1']);
        } catch (dnsErr) {
            console.warn("Failed to set DNS servers, proceeding with default resolver:", dnsErr.message);
        }
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongodb connected successfully");
        await seedFaculty();
    } catch (error) {
        console.log("MONGODB Connection Failed", error);
    }
}

export default connectDB;