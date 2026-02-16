"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const CallToActionSection = () => {
  return (
    <div className="relative py-24">
      <Image
        src="/landing-call-to-action.jpg"
        alt="Rentiful Search Section Background"
        fill
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/60" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-4xl px-8 py-12 xl:max-w-6xl"
      >
        <div className="flex flex-col justify-between text-center md:flex-row md:text-left">
          <div className="mb-6 md:mr-10 md:mb-0">
            <h2 className="text-2xl font-bold text-white">
              Find Your Dream Rental Property
            </h2>
          </div>
          <div>
            <p className="mb-3 text-white">
              Discover a wide range of rental properties in your desired
              location.
            </p>
            <div className="flex justify-center gap-4 md:justify-start">
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-primary-700 hover:bg-primary-500 hover:text-primary-50 rounded-lg bg-white"
              >
                Search
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-secondary-500 hover:bg-secondary-600 rounded-lg text-white"
              >
                <Link href="/signup" scroll={false}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallToActionSection;
