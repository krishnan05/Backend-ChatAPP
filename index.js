const express = require("express");
const app = express(); 
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const socket = require("socket.io");

dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/message", messageRoute);

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connection Successful!");
}).catch((err) => console.log(err));

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on Port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {
        origin: process.env.ORIGIN,
        credentials: true,
    },
});

const onlineUsers = new Map();
const userGroupMap = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieved", data.message);
        }
    });

    socket.on("join-group", ({ userId, groupId }) => {
        socket.join(groupId);
        
        if (!userGroupMap.has(groupId)) {
            userGroupMap.set(groupId, [userId]);
            
        } else {
            const usersInGroup = userGroupMap.get(groupId);
            if (!usersInGroup.includes(userId)) {
                usersInGroup.push(userId);
                userGroupMap.set(groupId, usersInGroup);
            }
        }

        socket.emit("group-added", { userId, groupId });
    });

    socket.on("send-group-msg", (data) => {
        const sender = data.sender;
        const usersInGroup = userGroupMap.get(data.group);
        if (usersInGroup) {
            usersInGroup.forEach((userId) => {
                const userSocketId = onlineUsers.get(userId);
                if (userSocketId) {
                    socket.to(userSocketId).emit("groupMessage", { sender, message: data.message });
                }
            });
        } else {
            console.log(`No users found in group ${data.group}`);
        }
    });

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

});
