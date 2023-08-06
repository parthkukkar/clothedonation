import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
config();

const DB='mongodb+srv://parthkukkar4:parth1234@cluster0.ulytmnz.mongodb.net/myLoginRegisterDB?retryWrites=true&w=majority'

const port=process.env.PORT || 3000
const app=express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors())


//CONNECTING database
mongoose.connect(DB,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},()=>{
    console.log("DB CONNECTED");
});

//create a user schema
const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    Mobile_number:String,
    Address:String,
    password:String

})

//create model
const User = new mongoose.model("User",userSchema)




// Define a schema for your data
const dataSchema = new mongoose.Schema({
  email:String,
    Name:String,
    addressofuser:String,
    MobileNumber:String,
    dataArray: [String], 
    date:String,
    time:String,
    status: {
      type: String,
      default: 'pending', 
    },
  });
  
  
  const DataModel = mongoose.model('Data', dataSchema);


  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        if (password === user.password) {
          
          // console.log(username);
          res.send({ message: "Login Successful!", user: user });
        } else {
          res.send({ message: "Password did not match! " });
        }
      } else {
        res.send({ message: "User not registered" });
      }
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
  

//routes
app.post("/register",(req,res)=>{

//in req.body came the user state which we created in frontend register.js
const{name,email,Mobile_number,Address,password}=req.body
User.findOne({email:email},(err,user)=>{
    if(user)
    {
        res.send({message:"User already registered"})
    }
    else{

const user = new User({
    name,
    email,
    Mobile_number,
    Address,
    password
})

// save in db
user.save(err=>{
    
        if(err)
        {
            res.send(err)
        }else{
            res.send({message:"Successfully Registered"})

        }
    }
)


    }
})

})



app.post("/donate",async(req,res)=>{
  
   
    let {  email,dataArray,date,time ,status} = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
  
   
  
    saveDataToMongoDB(email,user.name,user.Address,user.Mobile_number,dataArray,date,time,status)
      .then(() => {
        res.status(200).json({ message: 'Thanks for your donation' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Something went wrong' });
      });
    
    })
    

    function saveDataToMongoDB(email,Name,addressofuser,MobileNumber,dataArray,date,time,status) {
        return new Promise((resolve, reject) => {
          // Save the array to MongoDB
          const newData = new DataModel({email,Name,addressofuser,MobileNumber, dataArray ,date,time,status});
         
          newData.save((err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }



      app.get('/history', async (req, res) => {
        try {
          const userEmail = req.query.email; // Retrieve the email from the query parameters
      
          if (!userEmail) {
            return res.status(400).json({ message: 'Email parameter missing in the request.' });
          }
      
          const userDonations = await DataModel.find({ email: userEmail });
      
          if (userDonations.length === 0) {
            return res.status(404).json({ message: 'No donation history found for the provided email.' });
          }
      
          const donationHistory = userDonations.map((donation) => {
            return {
              dataArray: donation.dataArray,
              status: donation.status
            };
          });
      
          res.status(200).json(donationHistory);
        } catch (error) {
          res.status(500).json({ error: 'Something went wrong while fetching donation history.' });
        }
      });
      

      app.get('/admin/getUserData', async (req, res) => {
        try {
          const allUserData = await DataModel.find();
          res.status(200).json(allUserData);
        } catch (error) {
          res.status(500).json({ error: 'Something went wrong while fetching user data.' });
        }
      });

      app.put('/admin/markAsPicked', async (req, res) => {
        const { userId, status } = req.body;
        try {
          const donation = await DataModel.findById(userId);
          if (!donation) {
            return res.status(404).json({ message: 'Donation not found.' });
          }
          donation.status = status; 
          await donation.save();
          res.status(200).json({ message: 'Donation marked as picked.' });
        } catch (error) {
          res.status(500).json({ error: 'Something went wrong while updating the donation status.' });
        }
      });
      
      
      
      
    


app.listen(process.env.PORT || 3000,()=>{
    console.log("connection startes at port ",port);
})







