import Image from "next/image";
import TestTimonialCard from "../common/TestTimonialCard";

const TestimonialsData = [
  {
    rating: 5,
    review:
      "Recify has completely transformed how I organize my recipes. The interface is beautiful and so easy to use!",
    name: "Sarah Mitchell",
    designation: "Home Chef",
    profile: "/images/profile.png",
    feature: false,
  },
  {
    rating: 5,
    review:
      "Love the clean design of Recify. Being able to access all my family recipes in one place is a game-changer. The meal planning feature saves me hours every week!",
    name: "Marcus Chen",
    designation: "Food Blogger",
    profile: "/images/profile.png",
    feature: true,
  },
  {
    rating: 5,
    review: "Simply brilliant! Recify makes cooking more enjoyable and organized.",
    name: "Emma Rodriguez",
    designation: "Culinary Student",
    profile: "/images/Moe-Partuj.jpeg",
    feature: false,
  },
];

const Testimonials = () => {
  return (
    <section
      id="reviews"
      className="bg-[#F1E7DD] relative overflow-hidden py-20 sm:py-32"
    >
      <div className="container mx-auto py-11 sm:py-16 px-6 sm:px-12 max-w-[1280px]">
        <p className="text-[#F64C20] text-base sm:text-xl font-bold leading-tight tracking-tight text-center font-[family-name:var(--font-pangram)] pb-3 sm:pb-4 uppercase">
          Reviews
        </p>
        <h2 className="text-[#1A0803] text-3xl sm:text-[48px] md:text-[64px] font-bold leading-tight tracking-tight font-[family-name:var(--font-pangram)] text-center pb-16 sm:pb-24 max-w-3xl mx-auto">
          What Our Users Say
        </h2>

        <div className="flex flex-wrap lg:flex-nowrap justify-center items-stretch gap-6 relative">
          {TestimonialsData.map((item, index) => (
            <TestTimonialCard data={item} key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
