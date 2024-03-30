import { app } from "./app.js";
import dotenv from "dotenv";
import  connectDB  from "./db/db.js";
dotenv.config({
  path: "./.env",
});

connectDB()
.then(() => {
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Server is running on port ${process.env.SERVER_PORT}`);
      });    
})
.catch((error)=>{
    console.log(error);
})