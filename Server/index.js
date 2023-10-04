import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { createTokens } from "./JWT.js";
import { validateToken } from "./JWT.js";
config();

const DB =
  "mongodb+srv://parth:parth1234@cluster0.asqm1kv.mongodb.net/donationdb?retryWrites=true&w=majority";

const port = process.env.PORT || 3000;
const app = express();
mongoose.set("strictQuery", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  credentials: true,
  origin: [
    "https://clothingdonation.netlify.app",
    "https://clothingdonationadmin.netlify.app",
    'http://localhost:3001'
    
  ], // React app's origin
};
app.use(cors(corsOptions));
app.use(cookieParser());

//CONNECTING database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => console.log(err));

//defining the structure of document(schema)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  Mobile_number: String,
  Address: String,
  password: String,
});

//creating collection named User
const User = new mongoose.model("User", userSchema);

const dataSchema = new mongoose.Schema({
  email: String,
  Name: String,
  addressofuser: String,
  MobileNumber: String,
  dataArray: [String],
  date: String,
  starttime: String,
  endtime: String,
  status: {
    type: String,
    default: "pending",
  },
});

const DataModel = mongoose.model("Data", dataSchema);

app.post("/login", async (req, res) => {
  console.log("reached at login");
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          const accessToken = createTokens(user);

          res.send({
            accesstoken: accessToken,
            message: "Login Successful!",
            id: user.id,
          });
        } else {
          res.send({ message: "Password did not match! " });
        }
      });
    } else {
      res.send({ message: "User not registered" });
    }
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

//routes
app.post("/register", (req, res) => {
  console.log("reached at register");
  const { name, email, Mobile_number, Address, password } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          // Handle any errors that occur during hashing
          return res.status(500).json({ error: "Password hashing failed" });
        }

        // created a document to be inserted in the collection
        const user = new User({
          name,
          email,
          Mobile_number,
          Address,
          password: hash, // Store the hashed password in the database
        });

        const accesstoken = createTokens(user);

        // save in db
        user.save((err) => {
          if (err) {
            res.send(err);
          } else {
            res.send({
              accesstoken: accesstoken,
              message: "Successfully Registered",
              id: user.id,
            });
          }
        });
      });
    }
  });
});

app.post("/donate", validateToken,async (req, res) => {
  console.log("reached")
  const { dataArray, date, sttime, endtime, status, id, accessToken } = req.query;
  
 
 
 

  const user = await User.findOne({ _id: id });
  // console.log(`id is ${id}`);
  // console.log(`user is ${user}`)

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  saveDataToMongoDB(
    user.email,
    user.name,
    user.Address,
    user.Mobile_number,
    dataArray,
    date,
    sttime,
    endtime,
    status
  )
    .then(() => {
      res.status(200).json({ message: "Thanks for your donation" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Something went wrong" });
    });
});

function saveDataToMongoDB(
  email,
  Name,
  addressofuser,
  MobileNumber,
  dataArray,
  date,
  sttime,
  etime,
  status
) {
  return new Promise((resolve, reject) => {
    // Save the array to MongoDB
    const newData = new DataModel({
      email,
      Name,
      addressofuser,
      MobileNumber,
      dataArray,
      date,
      starttime: sttime,
      endtime: etime,
      status,
    });

    newData.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


app.get("/history", validateToken, async (req, res) => {
  const accessToken = req.query.accesstoken;
  const id=req.query.id;

  // You can now use the accessToken in your server logic
  // console.log('Access Token:', accessToken);
  // console.log(`id ${id}`)
  try {
    // const id = req.cookies["id"];
      

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const userDonations = await DataModel.find({ email: user.email });

    const donationHistory = userDonations.map((donation) => {
      return {
        dataArray: donation.dataArray,
        status: donation.status,
      };
    });

    res.status(200).json(donationHistory);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching donation history." });
  }
});

app.get("/admin/getUserData", async (req, res) => {
  console.log("reached ");
  try {
    const allUserData = await DataModel.find();

    res.status(200).json(allUserData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong while fetching user data." });
  }
});

app.put("/admin/markAsPicked", async (req, res) => {
  const { userId, status } = req.body;
  try {
    const donation = await DataModel.findById(userId);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found." });
    }
    donation.status = status;
    await donation.save();
    res.status(200).json({ message: "Donation marked as picked." });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong while updating the donation status.",
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("connection startes at port ", port);
});
