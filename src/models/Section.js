import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
    },
    batchId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Section =
  mongoose.models.Section || mongoose.model("Section", sectionSchema);

export default Section;
