const express = require("express");
const router = express.Router();
const Person = require("../models/person");
const { jwtAuthMiddleware, generateToken } = require("../jwt");
// const res = require("express/lib/response");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    //logic for only existance of one admin in our system
    const adminPerson = await Person.findOne({ role: "admin" });
    if ((data.role = "admin" && adminPerson)) {
      return res
        .status(400)
        .json({
          message:
            "can't create person with role admin if admin already exists",
        });
    }

    // Validate Aadhar Card Number must have exactly 12 digit
    if (!/^\d{12}$/.test(data.aadharNumber)) {
      return res
        .status(400)
        .json({ error: "Aadhar Card Number must be exactly 12 digits" });
    }
    // Check if a user with the same Aadhar Card Number already exists
    const existingUser = await Person.findOne({
      aadharNumber: data.aadharNumber,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({
          error: "User with the same Aadhar Card Number already exists",
        });
    }

    const newPerson = new Person(data);

    //save new person in db
    const response = await newPerson.save();
    console.log("data saved");

    if (newPerson.role === "admin") {
      const newRole = await Person.findOne(Person.role === "admin");
      if (!newRole) {
        next();
      }
    }
    const payload = {
      id: response.id,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Token is:", token);
    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Extract username and password from request body
    const { aadharNumber, password } = req.body;

    // Find the user by username
    const person = await Person.findOne({ aadharNumber: aadharNumber });

    // If user does not exist or password does not match, return error
    if (!person || !(await person.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // generate Token
    const payload = {
      id: person.id,
    };
    const token = generateToken(payload);

    // return token as response
    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//we need a profile of user so can change password
router.get("./profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const personData = req.person;

    const personId = personData.id;
    const person = await Person.findById(personId);

    res.status(200).json({ person });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const personId = req.person.id;
    const { currentPassword, newPassword } = req.body;

    // Find the person by personId
    const person = await Person.findById(personId);

    //if password doesnot match
    if (!(await person.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid password" });
    }

    //update password
    person.password = newPassword;
    await person.save();

    console.log("Password updated");
    res.status(200).json({ message: "Password Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
