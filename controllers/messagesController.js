const messageModel = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const {from,to,message} = req.body;
        const data = await messageModel.create({
            message:{
                text: message
            },
            users: [
                from,
                to
            ],
            sender:from,
        });

        if(data) return res.json({
            msg: "Message added successfully!"
        });
        return res.json({ 
            msg: "Failed to add message to DB"
        });

    } catch (err) {
        next(err);
    }
};
module.exports.getAllMessage = async (req, res, next) => {
    try {
        const {from,to} = req.body;
        const messages = await messageModel.find({
            users:{
                $all: [from,to],
            },
        }).sort({ updatedAt: 1 });

        const projectMessages = messages.map((msg)=>{
            return{
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });

        res.json(projectMessages);
    } catch (error) {
        next(error);
    }
};
module.exports.addGroupMessage = async (req, res, next) => {
    try {
        const {message,group,from} = req.body;
       
        const data = await messageModel.create({
            message:{
                text: message
            },
            sender:from,
            group:group,
        });
        if(data) return res.json({
            msg: "Message added successfully!"
        });
        return res.json({ 
            msg: "Failed to add message to DB"
        });

    } catch (err) {
        next(err);
    }
};
module.exports.getAllGroupMessages = async (req, res, next) => {
    try {
        const {group,from} = req.body;
        
        const messages = await messageModel.find({
            group:{
                _id: group,
            },
        }).populate('sender').sort({ updatedAt: 1 });
        const projectMessages = messages.map((msg)=>{
            
            return{
                sender: msg.sender.username.toString(), 
                message: msg.message.text,
                fromSelf: msg.sender._id.toString() === from,
            };
        });
        
        res.json(projectMessages);
    } catch (error) {
        next(error);
    }
};