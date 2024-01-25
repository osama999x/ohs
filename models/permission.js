const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    permissionName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
