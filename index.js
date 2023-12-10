const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");


const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

// connect to MongoDb

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.cpvujej.mongodb.net/registrationformDB`, { useNewUrlParser: true, useUnifiedTopology: true });

// Creating Schema for db
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})

//Model for registration Schema
const Registration = mongoose.model("Registration", registrationSchema);
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get("/", (req, res) =>{
    res.sendFile(__dirname + "/login.html");
})

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Registration.findOne({ email: email });

        // Check for existing user
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            console.log("User already exists");
            res.redirect("/error");
        }
    } catch (error) {
        console.error(error);
        res.redirect("/error");
    }
});


app.get("/success", (req, res) =>{
    res.sendFile(__dirname + "/success.html");
})

app.get("/error", (req, res) =>{
    res.sendFile(__dirname + "/error.html");
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})