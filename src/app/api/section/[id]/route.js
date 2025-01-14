import { connectToDB } from "@/lib/db"; // Example DB connection
import Section from "@/models/Section"; // Example Section model

export async function GET(req, { params }) {
  try {
    await connectToDB();

    // Fetch all sections based on batchId
    const sections = await Section.find({ batchLink: params.id });

    return new Response(JSON.stringify(sections), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch sections", { status: 500 });
  }
}