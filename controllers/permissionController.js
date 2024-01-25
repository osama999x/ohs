const Permission = require("../models/permission");

const addPermission = async (req, res) => {
  try {
    const { permissionName } = req.body;
    if (!permissionName) {
      return res.status(401).json({ message: "Please enter the field" });
    }
    const newPermission = new Permission({
      permissionName: permissionName,
    });

    const savedPermission = await newPermission.save();

    return res.status(201).json({
      message: "Permission added successfully",
      permission: savedPermission,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred.", error: error.message });
  }
};
const getPermission = async (req, res) => {
  const P = await Permission.find();
  if (P) {
    return res.status(200).send({ message: "All Permissions", data: P });
  } else {
    return res.status(400).send({ message: "No Permissions Found" });
  }
};

module.exports = { addPermission, getPermission };
