import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`);
    console.log(`DB connected at: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("Failed to connect to the database");
    process.exit(1);
  }
};
// export { connectDB };
export default connectDB;
