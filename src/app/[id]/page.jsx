import React from "react";
import SectionPage from "@/components/page/Section";
import { connectToDB } from "@/lib/db";
import Batch from "@/models/hsc";
import Section from "@/models/Section";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  await connectToDB();

  const batch = await Batch.findOne({ link: params.id });

  if (!batch) {
    return notFound();
  }

  return <SectionPage params={params} />;
}
