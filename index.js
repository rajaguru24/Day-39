const express = require("express");

const mongoose = require("mongoose");

const body_parser = require("body-parser");

const app = express();

require("dotenv").config();

const PORT = process.env.PORT;

const Mentor = require("./Models/Mentor");

const Student = require("./Models/Student");

const mongoDB_URL = "mongodb+srv://Rajaguru:guvi@cluster0.y4kjayg.mongodb.net/"

mongoose
  .connect(mongoDB_URL, {})
  .then(() => console.log("Mongo DB is connected"))
  .catch((err) => console.log("Cannot connect to mongo DB", err));

//app.use(body_parser.json());

app.get("/", (req, res) => {
  res.send("Working good");
});

// API to create Mentor
app.post("/mentor", async (req, res) => {
  try {
    const mentorName = new Mentor(req.body);
    await mentorName.save();
    res.status(200).send(mentorName);
  } catch (error) {
    res.status(400).send(error);
  }
});

// API to create Student
app.post("/student", async (req, res) => {
  try {
    const studentName = new Student(req.body);
    await studentName.save();
    res.status(200).send(studentName);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Write API to Assign a student to Mentor
app.post("/mentor/:mentorID/assign", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorID);
    const students = await Student.find({ _id: { $in: req.body.students } });

    res.status(200).send(students);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Write API to Assign or Change Mentor for particular Student
app.put("/student/:studentID/changeMentor/:mentorID", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentID);
    const mentor = await Mentor.findById(req.params.mentorID);

    if (student.cMentor) {
      student.pMentor.push(student.cMentor);
    }

    student.cMentor = mentor._id;
    student.save();

    res.status(200).send(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Write API to show all students for a particular mentor
app.get("/mentor/:mentorID/students", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorID).populate(
      "students"
    );
    res.status(200).send(mentor);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Write an API to show the previously assigned mentor for a particular student
app.get("/student/:studentID/pMentor", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentID).populate(
      "pMentor"
    );
    res.status(200).send(student);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is connected on PORT : ${PORT}`);
});