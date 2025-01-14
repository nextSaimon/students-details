import React from "react";
import SectionPage from "@/components/page/Section";

export default function Page({ params }) {
    console.log("id is",params.id);

  return <SectionPage params={params} />;
}
