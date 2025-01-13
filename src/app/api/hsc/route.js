import { connectToDB } from "@/lib/db";
import Hsc from "@/models/hsc";

// Get HSC details (GET)
export async function GET(req) {
  try {
    await connectToDB();
    const hscDetails = await Hsc.find();
    return new Response(JSON.stringify(hscDetails), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch HSC details", { status: 500 });
  }
}

// Create HSC details (POST)
export async function POST(req) {
  try {
    await connectToDB();
    const { batch, session, year } = await req.json();

    const newHsc = new Hsc({ batch, session, year });
    await newHsc.save();

    return new Response(JSON.stringify(newHsc), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to save HSC details", { status: 500 });
  }
}

// Update HSC details (PUT)
export async function PUT(req) {
  try {
    await connectToDB();
    const { id, batch, session, year } = await req.json();

    const updatedHsc = await Hsc.findByIdAndUpdate(
      id,
      { batch, session, year },
      { new: true }
    );

    return new Response(JSON.stringify(updatedHsc), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to update HSC details", { status: 500 });
  }
}

// Delete HSC details (DELETE)
export async function DELETE(req) {
  try {
    await connectToDB();
    const { id } = await req.json();

    await Hsc.findByIdAndDelete(id);

    return new Response("HSC details deleted", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to delete HSC details", { status: 500 });
  }
}
