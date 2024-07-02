const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
  ],
  description: {
    type: String,
    default: '',
  },
  
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
