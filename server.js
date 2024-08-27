
const express = require("express");
const db = require("./db");
const Person = require("./models/person");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000 ;



app.get('/', function (req, res) {
    res.send('Welcome to our Voting Server');
})

app.use(bodyParser.json());

app.post("/person", async (req, res) => {
  try {
    //assuming req.body contains person data
    const data = req.body; 
    //create a new Person document in db
    const newPerson = new Person(data);
    //save new person in db
    const savedPerson = await newPerson.save();
    console.log("data saved");
    res.status(200).json(savedPerson);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



const personRoutes = require("./routes/personRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

app.use("/person", personRoutes);
app.use("/candidate", candidateRoutes);

app.listen(PORT , () => {
  console.log("Listening on port 3000");
});
