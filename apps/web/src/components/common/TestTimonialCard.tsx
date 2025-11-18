import Image from "next/image";
interface Props {
  data: {
    feature?: boolean;
    review: string;
    profile: string;
    name: string;
    designation: string;
  };
}

const TestTimonialCard = ({ data }: Props) => {
  return (
    <div
      className={`flex-1 min-w-[280px] max-w-[370px] space-y-6 h-auto rounded-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        data.feature ? "bg-[#F64C20] text-white" : "bg-white text-[#1A0803]"
      }`}
    >
      <div className="flex gap-1">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Image
              src="/images/star.svg"
              width={20}
              height={20}
              alt="star"
              key={index}
              className={data.feature ? "brightness-0 invert" : ""}
            />
          ))}
      </div>
      <blockquote
        className={`text-base sm:text-lg font-normal leading-relaxed font-[family-name:var(--font-inter)]`}
      >
        <span className="text-2xl">&ldquo;</span>
        {data.review}
        <span className="text-2xl">&rdquo;</span>
      </blockquote>
      <div className="flex gap-4 items-center pt-4">
        <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden border-2 border-current opacity-20">
          <Image
            className="w-full h-full object-cover"
            src={data.profile}
            width={48}
            height={48}
            alt={data.name}
          />
        </div>
        <div>
          <h4 className="text-base font-bold leading-tight font-[family-name:var(--font-pangram)]">
            {data.name}
          </h4>
          <p className={`text-sm font-normal leading-tight font-[family-name:var(--font-inter)] ${data.feature ? "opacity-90" : "opacity-60"}`}>
            {data.designation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestTimonialCard;
