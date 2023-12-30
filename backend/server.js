import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from 'stripe'
import fs from 'fs'

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

app.post("/delete/uploads", async (req, res) => {
  const oldPhotoPath = req.body.oldAvatar.replace('/uploads', ''); 

  if (oldPhotoPath) {
    fs.unlink(uploadDestination + oldPhotoPath, (err) => {
      if (err) {
        console.error("Error deleting old photo: ", err);
      }
    });
  }

  res.status(200).json({message: 'Success'})
}) 

app.use("/user", userRouter) 
app.use("/dashboard", dashboardRouter)
  
//VACANCY 
 
// Будет три роута - /company/..., /dashboard/..., and /user/...
// В /dashboard/... - роуте любой пользователь сайта может посмотреть главуную страницу 'dashboard', проекты и вакансии.
// В /user/... - роуте только зарегестрированые юзеры могут создавать и редактировать свои проекты, создавать и удалять комментарии.
// В /company/... - роуте только зарегестрированые компании могут создавать и редактировать свои вакансии, создавать и удалять комментарии.
 
 

// PAYMENT METHOD (STRIPE)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

app.get('/config-payment', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  })  
})
 
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: req.body.title,
              images: ['https://website-assets-fs.freshworks.com/attachments/ckbsryqms00q2heg19ekuza1r-it-product-management0.one-half.png']
            },
            unit_amount: Math.round(Number(req.body.price) * 100)
          },
          quantity: 1,
        }
    ],
      mode: 'payment',
      success_url: `http://localhost:3000/dashboard`,
      cancel_url: `http://localhost:3000/dashboard`,
    })

    res.json({id: session.id})

  } catch (error) {
    return res.status(400).json({message: 'Problem with payment: ' + error})
  }
})


// SERVER
 
app.listen(process.env.PORT, (err) => {
  if (err) console.log("Server is not OK.\n" + err);
  console.log("Server is OK.");
});
