import { connectToDB } from "@/lib/db";

import Section from "@/models/Section";
import Batch from "@/models/Batch";

export async function POST(req) {
  try {
    await connectToDB();

    const { name, hsc_batch } = await req.json();
    console.log(name, hsc_batch);

    const year = hsc_batch.split("-")[1];
    // Check if a section with the same name already exists
    const existingSection = await Section.findOne({
      sectionName: name,
      batchLink: hsc_batch,
    });

    if (existingSection) {
      return new Response(
        JSON.stringify({ error: "Section with this name already exists" }),
        { status: 400 }
      );
    }

    // find year of batch
    const batch = await Batch.findOne({ batch: year });
    // _id of batch
    const hsc_batch_id = batch._id;
    const newSection = new Section({
      sectionName: name,
      batchId: hsc_batch_id,
      batchLink: hsc_batch,
    });

    await newSection.save();
    return new Response(JSON.stringify(newSection), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to create section", { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDB();

    const { id, name } = await req.json();

    // Check if a section with the same name already exists, excluding the current one
    const existingSection = await Section.findOne({
      sectionName: name,
      _id: { $ne: id },
    });

    if (existingSection) {
      return new Response(
        JSON.stringify({ error: "Section with this name already exists" }),
        { status: 400 }
      );
    }

    // Find and update the section by id
    const updatedSection = await Section.findByIdAndUpdate(
      id,
      { sectionName: name },
      { new: true }
    );

    if (!updatedSection) {
      return new Response("Section not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedSection), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to update section", { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();

    const { id } = await req.json();

    // Find and delete the section by id
    const deletedSection = await Section.findByIdAndDelete(id);

    if (!deletedSection) {
      return new Response("Section not found", { status: 404 });
    }

    return new Response("Section deleted successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to delete section", { status: 500 });
  }
}
