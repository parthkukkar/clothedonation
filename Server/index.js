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
app.use(express.json());
app.use(express.urlencoded());
const corsOptions = {
  origin: [
    "https://clothingdonation.netlify.app",
    "https://clothingdonationadmin.netlify.app",
  ],

  credentials: true,
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
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          const accessToken = createTokens(user);
          //cokie that will be stored in clients browser so that he remains logged in

          res.cookie("access-token", accessToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          }); // 30 days in milliseconds

          res.cookie("id", user.id, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: false,
          }); // 30 days in milliseconds

          res.send({ message: "Login Successful!" });
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

app.get("/logout", (req, res) => {
  try {
    res.clearCookie("id");
    res.clearCookie("access-token");
    res.status(200).send("logged out suuccess");
  } catch (err) {
    res.status(404).send("some error occured!");
  }
});

//routes
app.post("/register", (req, res) => {
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
        res.cookie("access-token", accesstoken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        res.cookie("id", user.id, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: false,
        });

        // save in db
        user.save((err) => {
          if (err) {
            res.send(err);
          } else {
            res.send({ message: "Successfully Registered" });
          }
        });
      });
    }
  });
});

app.post("/donate", validateToken, async (req, res) => {
  let { dataArray, date, sttime, endtime, status } = req.body;
  const id = req.cookies["id"];

  const user = await User.findOne({ _id: id });

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
  try {
    const id = req.cookies["id"];

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
