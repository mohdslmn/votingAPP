<div align="center">
  <br />
      <img src="./votePic.jpg" alt="Project Banner" width="850" height="450">
    </a>
  <br />

  <h3 align="center">A Voting App</h3>

   <div align="center">
     Build this project step by step with our detailed tutorial on <a href="https://www.linkedin.com/posts/md-salman-dev_nodejs-expressjs-mongodb-activity-7226878321127489538-jkra?utm_source=share&utm_medium=member_desktop" target="_blank"><b>LinkedIn</b></a> 
    </div>

</div>
  ## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)


## <a name="introduction">🤖 Introduction</a>

This voting application is built using Node.js for server-side logic, Express.js for handling routes and middleware, and MongoDB

for data storage. It features secure JWT-based user authentication, AadharCard number login, and real-time vote tracking. Designed 
 
for simplicity and efficiency, this app aims to provide a seamless voting experience.


## <a name="tech-stack">⚙️ Tech Stack</a>

- Node.js
- Express.js
- JWT
- MongoDB
  

## <a name="features">🔋 Features</a>

👉 **Sign-up/Sign-in**: User can sign-up and get JWT token and user can login with Aadharcard Number and Password.

👉 **Authentication**: Without Authentication user not allowed to access the account.


👉 **Update Password**: User can update password.

👉 **Vote**:  User can vote set of Candidates and user can vote only once.

👉 **Only One Admin**: There is no more than one admin in this app and amdin can't vote.

👉 **Candidate Live Vote Count**: Dynamically updates candidate vote count.


## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone 
cd votingAPP
```

**Installation**

Install the project dependencies using npm:

**Connect to your MongoDB**

create .env file and add PORT & MONGODB_URI

```bash
npm install
```

**Running the Project**

```bash
npm server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.



