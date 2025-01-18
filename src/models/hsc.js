import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  batch: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const hsc = mongoose.models.HSC || mongoose.model("HSC", batchSchema);

export default hsc;
