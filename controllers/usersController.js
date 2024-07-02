const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Group = require('../models/groupModel');
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username ", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const usernameCheck = await User.findOne({ username });
      if (usernameCheck)
        return res.json({ msg: "Username already used", status: false });
      const emailCheck = await User.findOne({ email });
      if (emailCheck)
        return res.json({ msg: "Email already used", status: false });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
      });
      delete user.password;
      return res.json({ status: true, user });
    } catch (ex) {
      next(ex);
    }
  };


  module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users  = await User.find({
        _id:{ $ne:req.params.id }
      }).select([
        "email",
        "username",
        "_id"
      ]);
      return res.json(users);
    } catch (err) {
      next(err);
    }
  };

  module.exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };

  
  module.exports.getAllGroups = async (req, res, next) => {
    try {
      const userIdToFind = req.params.id;
      const groups = await Group.find({ members: userIdToFind });
      return res.json(groups);
    } catch (err) {
      next(err);
    }
  };

  module.exports.newgroup = async (req, res, next) => {
    try {
      const { name, creator, participants } = req.body;

const usernameCheck = await User.findOne({ _id: creator._id });
const users = [usernameCheck];
const participantsUserIds = await User.find({ username: { $in: participants.map(user => user) } })
  .select('_id');
participantsUserIds.push(creator._id);

const group = await Group.create({
  name,
  members: participantsUserIds,
});

      const groupsWithUser = await Group.find({ members: creator });
      return res.json({ status: true,groupsWithUser });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.addmembers = async (req, res, next) => {
    try {
      const { group} = req.body;
      const usernameCheck = await User.findOne({ _id:{ $ne:req.params.id }});
      if(usernameCheck){
         Group.updateOne(
          { _id: group._id },
          { $push: { members: userIdToAdd } },
          (err, result) => {
            if (err) {
              console.error(err);
            } else {
              console.log(result);
            }
          }
        );
      }

    }catch (err) {
      next(err);
    }
  };


async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
        {
            headers: { Authorization: `Bearer ${process.env.API_TOKEN}`,
           'Content-Type': 'application/json'  },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', response.status, response.statusText, errorText);
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
  }

    const result = await response.json().catch(err => {
        console.error('Error parsing JSON:', err);
        throw err;
    });
    // const result = await response.json();
    return result;
}


module.exports.chatbot= async(req, res, next)=>{
  try {
    const userMessage = req.body.message;
    const reply = await query({inputs:userMessage});
    return res.json({ status: true,reply });
  }catch (err) {
    next(err);
  }
};
