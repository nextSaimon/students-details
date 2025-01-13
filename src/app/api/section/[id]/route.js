import { connectToDB } from "@/lib/db"; // Example DB connection
import Section from "@/models/Section"; // Example Section model
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // Await the params.id to resolve the promise
    const { id } = await params;

    await connectToDB();
    const section = await Section.find({ batchId: id });
    return NextResponse.json(section);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
