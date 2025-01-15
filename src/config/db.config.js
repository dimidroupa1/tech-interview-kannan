import mongoose from "mongoose";
import environmentConfig from "./environment.config.js";

const connectDB = async () => {
  try {
    await mongoose
      .connect(environmentConfig.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((data) => {
        console.log(`Database connected with ${data.connection.host}`);
      });
  } catch (error) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
