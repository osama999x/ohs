const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    role_Name: {
      type: String,
      required: true,
      unique: true,
    },
    permission: [
      {
        Permission_id: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "Permission",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
