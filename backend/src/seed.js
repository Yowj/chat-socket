import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/model_user.js";
import { connectDB } from "./lib/db.js";
import dotenv from "dotenv";

dotenv.config();

const seedUsers = [
  {
    username: "john_doe",
    email: "john.doe@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    username: "jane_smith",
    email: "jane.smith@example.com", 
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    username: "mike_johnson",
    email: "mike.johnson@example.com",
    password: "password123", 
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    username: "sarah_wilson",
    email: "sarah.wilson@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  {
    username: "david_brown",
    email: "david.brown@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    username: "lisa_garcia",
    email: "lisa.garcia@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=6"
  },
  {
    username: "alex_martinez",
    email: "alex.martinez@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=7"
  },
  {
    username: "emma_taylor",
    email: "emma.taylor@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=8"
  },
  {
    username: "ryan_anderson",
    email: "ryan.anderson@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=9"
  },
  {
    username: "olivia_thomas",
    email: "olivia.thomas@example.com",
    password: "password123",
    avatar: "https://i.pravatar.cc/150?img=10"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");
    
    // Hash passwords for all users
    const hashedUsers = await Promise.all(
      seedUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );
    
    // Insert seed users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Successfully seeded ${createdUsers.length} users`);
    
    // Display created users
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.email})`);
    });
    
    console.log("Database seeded successfully!");
    process.exit(0);
    
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();