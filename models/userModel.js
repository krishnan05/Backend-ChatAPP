const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        max: 20,
    },
    password:{
        type: String,
        required: true,
        min: 4,
    },
    groups: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Group',
        },
      ],
   
});

module.exports = mongoose.model("Users", userSchema);