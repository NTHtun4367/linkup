import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL!);
    console.log("MongoDb connected =>", conn.connection.host);
  } catch (error) {
    console.log("DB connection error =>", error);
    process.exit(1);
  }
};
