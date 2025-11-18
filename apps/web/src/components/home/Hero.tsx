import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="bg-[#F9F5F1] relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-[#B3E5FC] rounded-full opacity-30 blur-xl" />
      <div className="absolute bottom-40 left-20 w-40 h-40 bg-[#F2CC90] rounded-full opacity-30 blur-xl" />

      <div className="container mx-auto py-24 sm:py-48 px-6 sm:px-12 max-w-[1280px]">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-16">
          <div className="flex-1 max-w-[680px]">
            <h1 className="font-[family-name:var(--font-pangram)] pb-6 sm:pb-8 text-[#1A0803] text-[44px] sm:text-[72px] font-bold leading-[1.1] tracking-tight">
              Organize Your <br />
              <span className="text-[#F64C20]">Recipes</span> Beautifully
            </h1>
            <p className="font-[family-name:var(--font-inter)] pb-8 sm:pb-12 text-[#2C2726] text-lg sm:text-2xl font-normal leading-relaxed">
              Discover, save, and organize your favorite recipes all in one place.
              Create your personal cookbook and never lose a recipe again.
            </p>
            <Link href={"/notes"}>
              <button className="button-primary gap-2.5 px-10 py-5 font-[family-name:var(--font-pangram)] text-white text-lg sm:text-2xl font-bold leading-tight hover:shadow-lg">
                Get Started Free
              </button>
            </Link>
          </div>

          <div className="flex-1 max-w-[570px] w-full">
            <div className="relative w-full h-[380px] sm:h-[550px]">
              {/* Orange glow effect */}
              <div className="absolute z-10 inset-0 flex justify-center items-center bg-[#F64C2033] opacity-50 blur-[120px] rounded-full">
                <Image
                  src={"/images/hero_image_bg.svg"}
                  width={541}
                  height={673}
                  alt="Recipe cards background"
                  className="w-[344px] sm:w-[480px]"
                />
              </div>
              {/* Main hero image */}
              <div className="absolute z-50 inset-0 flex justify-center items-center">
                <Image
                  src={"/images/hero.png"}
                  width={561}
                  height={456}
                  alt="Recipe organization interface"
                  className="w-[357px] sm:w-[500px] drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
