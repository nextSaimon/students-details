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

const Batch = mongoose.models.Batch || mongoose.model("Batch", batchSchema);

export default Batch;
