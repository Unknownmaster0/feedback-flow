import { log } from "console";
import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

const DB_URI = "mongodb+srv://trySingh:sa123@try-clustor0.59gvu.mongodb.net/";
const DB_NAME = "Feedback-app";

// MAIN CONNECTION LOGIC OF THE DABATASE.
const connectDb = async () => {
  // IF ALREADY HAVE THE CONNECTION WITH DB, THEN NO NEED TO MAKE THE DB CONNECTION AGAIN.
  if (connection.isConnected) {
    log("already connected with db");
    return;
  }
  try {
    const connectionResponse = await mongoose.connect(
      `${DB_URI}/${DB_NAME}`
    );
    // const connectionResponse = await mongoose.connect(
    //   `${process.env.DB_URI}/${process.env.DB_NAME}`
    // );
    connection.isConnected = connectionResponse.connections[0].readyState;
  } catch (error) {
    log("error while connection with db", error);
    process.exit();
  }
};

export default connectDb;
