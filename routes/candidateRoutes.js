const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const Person = require("../models/person");


//function to check one is accessing candidate route is admin or not
 const checkAdmin = async (personId) => {
  try{  
  const user = await Person.findById(personId) ;
  return user.role === 'admin'
  }catch(err){
    return false;
  }
 }

//post route to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if(! await checkAdmin(req.person.id)){
      return res.status(403).json({message : "person does not have admin role"});
    }
    const data = req.body;
    const newCandidate = new Candidate(data);

    //save new person in db
    const response = await newCandidate.save();
    console.log("data saved");

 
    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if(! await checkAdmin(req.person.id))
      return res.status(403).json({message : "person does not have admin role"});

    const candidateID = req.params.candidateID;
    const updatedCandidateData = req.body;


    // Find the person by personId
    const response = await Candidate.findByIdAndUpdate(candidateID,updatedCandidateData, {
      new: true,
      runValidators : true ,
    });


   
    if (!response) {
      // console.log(updatedCandidateData);
      return res.status(404).json({ error: "Candidate Not Found" });
    }
    console.log("Candidate Data Updated ");
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if(! await checkAdmin(req.person.id))
      return res.status(403).json({message : "person does not have admin role"});

    const candidateID = req.params.candidateID;
    

    // Find the person by personId
    const response = await Candidate.findByIdAndDelete(candidateID);

    //if password doesnot match
    if (!response) {
      return res.status(401).json({ error: "Candidate Not Found" });
    }


    console.log("Candidate Deleted ");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//voting routes
router.post("/vote/:candidateID",jwtAuthMiddleware, async (req, res) => {
   candidateID = req.params.candidateID;
   personID = req.person.id;

   try{
    //find the candidate
    const candidate = await Candidate.findById(candidateID);
    if(!candidate){
      return res.status(404).json({message: "candidate not found"});
    }
    const user = await Person.findById(personID);
    if(user.isVoted){
      return res.status(400).json({message: "You have already voted"});
    }
    if(user.role === 'admin'){
      return res.status(403).json({message: "Admin can't vote"});
    }
    //update candidate
    candidate.votes.push({user : personID})
    candidate.voteCount++;
    await candidate.save();

    //update user
    user.isVoted = true;
    await user.save();

    res.status(200).json({message: "Vote recorded successfully"})
   }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal server error'});
   }
  });
  
  

   //vote count
   router.get('/vote/count', async (req , res) => {
    try{
      //find and sort candidate according to vote count in descending order
      const candidate = await Candidate.find().sort({voteCount : 'desc'});

      //Map the candidates to only return name and vote count
      const voteRecord = candidate.map((data) => {
        return{
          party: data.party,
          count : data.voteCount
        }
      });
      return res.status(200).json(voteRecord);

    }catch(err){
    console.log(err);
    res.status(500).json({error: 'Internal server error'});
   }
   })


  // list of candidates
router.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find({},' name party -_id');
    console.log(candidates);

    // Check if the list is empty
    if (candidates.length === 0) {
      return res.status(404).json({ message: "Candidate list is empty" });
    }

    return res.status(200).json(candidates);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
