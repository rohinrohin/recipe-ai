import Image from "next/image";

const benefits = [
  {
    title: "Easy Recipe Discovery",
    description: "Find and save recipes from anywhere with our intuitive interface",
    image: "/images/goodNews.png",
    bgColor: "#B3E5FC",
  },
  {
    title: "Smart Organization",
    description:
      "Access your recipes anytime, anywhere, with seamless cloud synchronization.",
    image: "/images/cloudSync.png",
    bgColor: "#F2CC90",
  },
  {
    title: "Meal Planning Made Easy",
    description:
      "Plan your weekly meals and generate shopping lists automatically.",
    image: "/images/googleCalander.png",
    bgColor: "#BDBDFF",
  },
  {
    title: "AI Recipe Assistant",
    description:
      "Get cooking tips and substitution suggestions powered by AI.",
    image: "/images/bot.png",
    bgColor: "#99EBA0",
  },
];

const Benefits = () => {
  return (
    <section id="Benefits" className="relative bg-white py-20 sm:py-32">
      <div className="container mx-auto py-16 px-6 md:px-12 max-w-[1280px]">
        <p className="text-[#F64C20] text-base sm:text-xl font-bold leading-tight tracking-tight text-center font-[family-name:var(--font-pangram)] pb-3 sm:pb-4 uppercase">
          Benefits
        </p>
        <h2 className="text-[#1A0803] text-3xl sm:text-[48px] md:text-[64px] font-bold leading-tight tracking-tight font-[family-name:var(--font-pangram)] text-center pb-16 sm:pb-24 max-w-3xl mx-auto">
          Why Choose Recify
        </h2>

        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 z-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group flex gap-4 sm:gap-6 bg-[#F9F5F1] items-start rounded-xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#F64C20]"
              >
                <div
                  className="min-w-16 sm:min-w-20 h-16 sm:h-20 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: benefit.bgColor }}
                >
                  <Image
                    src={benefit.image}
                    width={48}
                    height={48}
                    alt={benefit.title}
                    className="w-10 sm:w-12"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#1A0803] text-xl sm:text-3xl font-bold leading-tight pb-3 sm:pb-4 font-[family-name:var(--font-pangram)]">
                    {benefit.title}
                  </h3>
                  <p className="font-[family-name:var(--font-inter)] text-[#2C2726] text-base sm:text-lg font-normal leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
