import { connectToDB } from "@/lib/db";

import Section from "@/models/Section";

export async function GET(req, { params }) {
  try {
    await connectToDB();

    // Fetch all sections based on batchId
    const sections = await Section.find({ batchId: params.id });
    return new Response(JSON.stringify(sections), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch sections", { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();

    const { name, hsc_batch } = await req.json();
    console.log(hsc_batch);

    const newSection = new Section({
      sectionName: name,
      batchId: hsc_batch,
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
