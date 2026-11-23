import React from "react";
import { SlideDeck } from "@/components/SlideDeck";
import { getPublicHubData } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getPublicHubData();

  return (
    <SlideDeck
      config={data.siteConfig}
      members={data.members}
      services={data.services}
    />
  );
}
