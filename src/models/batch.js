import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hsc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hsc",
  },
});

const Batch = mongoose.models.Batch || mongoose.model("Batch", batchSchema);

export default Batch;

