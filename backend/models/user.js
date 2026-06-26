import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Faculty", "Student"],
      required: true,
      default: "Student",
    },
    department: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: function () {
        return this.role === "Student";
      },
      validate: {
        validator: function (value) {
          return this.role !== "Student" || (this.role === "Student" && value !== undefined);
        },
        message: "Semester is required for students.",
      },
    },
    subject: {
      type: [String], // ✅ Now an array of strings
      required: function () {
        return this.role === "Faculty";
      },
      validate: {
        validator: function (value) {
          return this.role !== "Faculty" || (this.role === "Faculty" && value.length > 0);
        },
        message: "At least one subject is required for faculty.",
      },
    },
    profile: {
      profilePicture: {
        url: {
          type: String,
          default:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrwcRgFA-KFW6u0wScyvZEBWMLME5WkdeCUg&s",
        },
        public_id: { type: String }, // Cloudinary image ID
      },
      coverPhoto: {
        url: {
          type: String,
          default:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgXtZjBEssgCQ86M7tMn2oHbIdEYc5CbIZKQ&s",
        },
        public_id: { type: String },
      },
    },
    questionsAsked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // For students
    questionsAnswered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // For faculty
  },
  { timestamps: true }
);

// ✅ Prevent Overwrite Error
export const User = mongoose.models.User || mongoose.model("User", userSchema);
