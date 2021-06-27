const mongoose = require('mongoose');

const { Schema } = mongoose;

const RoleSchema = new Schema(
  {
    role: {
      type: String,
      maxlength: 254,
    },
    code: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;
