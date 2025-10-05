const mongoose = require("mongoose");
const { Schema } = mongoose;

const downloadSchema = new Schema(
  {
    downloadUrl: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Download", downloadSchema);
