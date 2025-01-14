import { connectToDB } from "@/lib/db";
import Batch from "@/models/Batch";
import Section from "@/models/Section";

// Get Batch details (GET)
export async function GET(req) {
  try {
    await connectToDB();
    const BatchDetails = await Batch.find();
    return new Response(JSON.stringify(BatchDetails), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch Batch details", { status: 500 });
  }
}

// Create Batch details (POST)
export async function POST(req) {
  try {
    await connectToDB();
    const { batch, session } = await req.json();

    const link = `Hsc-${batch}`;

    const isBatchExists = await Batch.findOne({ batch });

    if (isBatchExists) {
      return new Response(JSON.stringify({ error: "Batch already exists" }), {
        status: 400,
      });
    }
    const newBatch = new Batch({ batch, session, link });
    await newBatch.save();

    return new Response(JSON.stringify(newBatch), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to save Batch details", { status: 500 });
  }
}

// Update Batch details (PUT)
export async function PUT(req) {
  try {
    await connectToDB();
    const { id, batch, session, year } = await req.json();

    // Check if the new batch name already exists and it's not the current one being updated
    const existingBatch = await Batch.findOne({ batch });
    if (existingBatch && existingBatch._id.toString() !== id) {
      return new Response(
        JSON.stringify({ error: "Batch name already exists" }),
        { status: 400 }
      );
    }

    // Update the batch details
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { batch, session, year },
      { new: true }
    );

    if (!updatedBatch) {
      return new Response("Batch not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedBatch), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to update Batch details", { status: 500 });
  }
}

// Delete Batch details (DELETE)
export async function DELETE(req) {
  try {
    await connectToDB();
    const { id } = await req.json();

    const batch = await Batch.findById(id);
    if (!batch) {
      return new Response("Batch not found", { status: 404 });
    }

   
    const sections = await Section.find({ batchId: id });

    // Delete all sections associated with the batch
    for (const section of sections) {
      await Section.findByIdAndDelete(section._id);
    }

    // Delete the batch
    await Batch.findByIdAndDelete(id);

    return new Response("Batch details and associated sections deleted", {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to delete Batch details", { status: 500 });
  }
}
