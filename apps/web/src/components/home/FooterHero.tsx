import Image from "next/image";
import Link from "next/link";
import React from "react";

const FooterHero = () => {
  return (
    <div className="bg-[#F64C20] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-20 w-48 h-48 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>

      <div className="flex flex-wrap lg:flex-nowrap justify-between items-center container mx-auto py-20 sm:py-32 px-6 sm:px-12 max-w-[1280px] gap-12">
        <div className="max-w-[680px]">
          <h2 className="font-[family-name:var(--font-pangram)] text-white text-3xl sm:text-5xl md:text-[56px] font-bold leading-tight tracking-tight pb-6 sm:pb-8">
            Start Your Recipe Collection Journey
          </h2>
          <p className="text-white text-lg sm:text-xl md:text-2xl font-normal leading-relaxed font-[family-name:var(--font-inter)] pb-10 sm:pb-12 opacity-95">
            Sign up now and organize all your favorite recipes in one beautiful place with Recify
          </p>
          <Link href={"/notes"}>
            <button className="button flex justify-center items-center gap-3 px-10 py-5 rounded-xl text-[#1A0803] font-[family-name:var(--font-pangram)] text-lg sm:text-2xl font-bold hover:scale-105 transition-transform">
              Get Started For Free
            </button>
          </Link>
        </div>
        <div className="mt-8 lg:mt-0 flex justify-center">
          <Image
            src="/images/monitor.png"
            alt="Recify on desktop"
            width={560}
            height={456}
            className="drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default FooterHero;
