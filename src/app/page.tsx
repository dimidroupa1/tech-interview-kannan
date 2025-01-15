"use client"

import Banner from "@/components/Home/Banner/Banner";
import HomeLayout from "@/components/Layouts/HomeLayout";

export default function Home() {
  return (
    <main>
      <HomeLayout>
        <Banner />
      </HomeLayout>
    </main>
  );
}
