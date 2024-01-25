const Role = require("../models/role");
const mongoose = require("mongoose");

// Get all roles
const addRole = async (req, res) => {
  try {
    const { role_Name, permission } = req.body;

    if (!role_Name || !permission) {
      return res
        .status(400)
        .json({status:400, message: "Role Name and permission ID are required." });
    }

    const isExisted = await Role.findOne({
        role_Name: { $regex: new RegExp(role_Name, "i") },
    });

    if (isExisted) {
      return res.status(400).send({status:400, message: "Role Name Already Exists" });
    }

    const newRole = new Role({
      role_Name,
      permission,
    });

    const savedRole = await newRole.save();

    return res
      .status(200)
      .json({status:200, message: "Role added successfully", role: savedRole });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({status:400, message: "Validation error", error: error.message });
    }

    return res
      .status(500)
      .json({ status:500,message: "An error occurred.", error: error.message });
  }
};

const getAll = async (req, res) => {
  const get = await Role.find()
    .populate({
      path: "permission",
    })
    .populate({
      path: "permission.Permission_id",
      model: "Permission",
      select: "permissionName",
    });

  if (get) {
    return res.status(200).json({status:200, message: "All Roles.", data: get });
  }
};
const getById = async (req, res) => {
    const id=req.params.id;
    const get = await Role.find({_id:id})
      .populate({
        path: "permission",
      })
      .populate({
        path: "permission.Permission_id",
        model: "Permission",
        select: "permissionName",
      });

    if (get) {
      return res.status(200).json({status:200, message: "Role.", data: get });
    }
  }
const deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    const roleToDelete = await Role.findByIdAndRemove(roleId);

    if (!roleToDelete) {
      return res.status(404).json({status:404, message: "Role not found." });
    }


    return res.status(200).json({status:200, message: "Role deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status:500,message: "An error occurred.", error: error.message });
  }
};
const updateRole = async (req, res) => {
  try {
    const id = req.params.id;
    const { role_Name, permission } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({status:400, message: "Invalid Role ID" });
    }

    const existingRole = await Role.findById(id);

    if (!existingRole) {
      return res.status(404).json({status:404, message: "Role not found" });
    }

    if (role_Name) {
      existingRole.role_Name = role_Name;
    }

    if (permission) {
      existingRole.permission =permission // permission.map(item => new mongoose.Schema.ObjectId(item));
    }

    const updatedRole = await existingRole.save();

    return res
      .status(200)
      .json({status:200, message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ status:400,message: "Validation error", error: error.message });
    }

    return res
      .status(500)
      .json({status:500, message: "An error occurred.", error: error.message });
  }
};
module.exports = { addRole, getAll,getById, deleteRole, updateRole };
