import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routes/user.js";
import dashboardRouter from "./routes/dashboard.js";


dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDestination = path.join(__dirname, "/uploads/"); 

app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: false }))
app.use('/uploads', express.static('uploads'));

mongoose
  .connect( 
    `mongodb+srv://kinolov3:${process.env.MONGODB_PASSWORD}@boardgamecluster.cogypgy.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log("MongoDB is OK."))
  .catch((err) => console.log("MongoDB is not OK.\n" + err)); 
  
// MULTER

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, uploadDestination); 
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  },
});
 
const upload = multer({ storage: storage });

app.post("/uploads", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  }); 
});

 
app.use("/user", userRouter) 
app.use("/dashboard", dashboardRouter)
  
//VACANCY
 
// Будет три роута - /company/..., /dashboard/..., and /user/...
// В /dashboard/... - роуте любой пользователь сайта может посмотреть главуную страницу 'dashboard', проекты и вакансии.
// В /user/... - роуте только зарегестрированые юзеры могут создавать и редактировать свои проекты, создавать и удалять комментарии.
// В /company/... - роуте только зарегестрированые компании могут создавать и редактировать свои вакансии, создавать и удалять комментарии.

 


// SERVER
 
app.listen(process.env.PORT, (err) => {
  if (err) console.log("Server is not OK.\n" + err);
  console.log("Server is OK.");
});
