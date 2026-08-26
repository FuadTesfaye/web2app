"use client";

import React from "react";
import MarqueeTicker from "@/components/MarqueeTicker";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ConverterStudio from "@/components/ConverterStudio";
import CliCommandBox from "@/components/CliCommandBox";
import PlatformCards from "@/components/PlatformCards";
import NeobrutalUiKit from "@/components/NeobrutalUiKit";
import BenchmarkTable from "@/components/BenchmarkTable";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <MarqueeTicker />
        <Navbar />
        <main>
          <Hero />
          <ConverterStudio />
          <CliCommandBox />
          <PlatformCards />
          <NeobrutalUiKit />
          <BenchmarkTable />
          <Testimonials />
          <FaqSection />
          <CtaBanner />
        </main>
      </div>
      <Footer />
    </div>
  );
}
