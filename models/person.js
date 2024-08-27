const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type : Number,
        required : true
    },
    mobile:{
       type: String,
       required : true
    },
    email:{
        type: String,
    },
    address:{
        type: String,
        required : true
    },
    role: {
        type: String,
        enum : ['voter' , 'admin'],
        default: 'voter'
    },
    aadharNumber: {
        type: Number,
        required : true,
        unique: true
    },
    isVoted:{
        type: Boolean,
        default: false
    }

});

personSchema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();

    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
        // Override the plain password with the hashed one
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const Person = mongoose.model('Person' , personSchema);
module.exports = Person;