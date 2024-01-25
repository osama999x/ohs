const express = require("express");
const router = express.Router();
const authenticateUser=require("../middleware/auth")
const addrole = require("../controllers/roleController");

router.post("/addrole", addrole.addRole);
router.get("/getAll", addrole.getAll);
router.get("/ById/:id",addrole.getById);
router.delete("/delete/:id",addrole.deleteRole);
router.put("/update/:id",addrole.updateRole)
module.exports = router;
