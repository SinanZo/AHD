import React from "react";
import Layout from "../components/Layout";
import Reveal from "../components/Reveal";
import ServicesPremium from "../components/sections/ServicesPremium";

export default function Services() {
  const title = "Our Services | Abdulhaq Dimensions";
  const description = "Comprehensive interior solutions including curtains, blinds, upholstery, and wallpapers.";

  return (
    <Layout title={title} description={description}>
      <Reveal>
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <h1 id="services-heading" className="sr-only">Our Services</h1>
            <ServicesPremium />
          </div>
        </section>
      </Reveal>
    </Layout>
  );
}
