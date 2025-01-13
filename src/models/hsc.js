import mongoose from "mongoose";

const hscSchema = new mongoose.Schema({
  batch: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  
});

const Hsc = mongoose.models.Hsc || mongoose.model("Hsc", hscSchema);

export default Hsc;

