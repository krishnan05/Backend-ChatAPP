const { addMessage, getAllMessage, addGroupMessage, getAllGroupMessages} = require("../controllers/messagesController");


const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getAllMessage);
router.post("/addgrpmsg", addGroupMessage);
router.post("/getgrpmsg", getAllGroupMessages);

module.exports = router;
