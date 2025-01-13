import { connectToDB } from "@/lib/db";
import Batch from "@/models/Batch";

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
    const { batch, session, year } = await req.json();

    const link = `Hsc-${year}`;

    const newBatch = new Batch({ batch, session, year, link });
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

    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { batch, session, year },
      { new: true }
    );

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

    await Batch.findByIdAndDelete(id);

    return new Response("Batch details deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to delete Batch details", { status: 500 });
  }
}
