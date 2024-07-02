const { register, newgroup, getAllUsers, getAllGroups, chatbot } = require("../controllers/usersController");
const { login } = require("../controllers/usersController");
const { logOut } = require("../controllers/usersController");
const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout/:id", logOut);
router.get("/allUsers/:id", getAllUsers);
router.get("/allgroups/:id", getAllGroups); 
router.post("/addnewgroup", newgroup );
router.post("/chatbot", chatbot );

module.exports = router;
