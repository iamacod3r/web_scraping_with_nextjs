import mongoose from "mongoose";

let isConnected = false; // Variable to store the connection status

export const connectToDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MongoDB URI is not defined");
  }

  if (isConnected) {
    console.log("=> using existing database connection");
    return;
  }

  mongoose.set("strictQuery", true);

  try {
    console.log("=> using new database connection");
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      waitQueueTimeoutMS: 10000,
    });

    // Connection ready state
    // 1 = connected
    // 2 = connecting

    isConnected =
      db.connections[0].readyState == 1 || db.connections[0].readyState == 2;

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};
