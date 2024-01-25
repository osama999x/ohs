const express = require("express");
const router = express.Router();

const addPermissions = require("../controllers/permissionController");

router.post("/addPermissions", addPermissions.addPermission);
router.get("/getAllPermissions", addPermissions.getPermission);

module.exports = router;
