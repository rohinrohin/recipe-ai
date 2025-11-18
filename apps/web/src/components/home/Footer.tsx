import React from "react";
import Logo from "../common/Logo";
import Menu from "../common/Menu";

const menuItems = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Benefits",
    url: "#Benefits",
  },
  {
    title: "Get Started",
    url: "/notes",
  },
  {
    title: "Reviews",
    url: "#reviews",
  },
];

const Footer = () => {
  return (
    <>
      <div className="container mx-auto hidden sm:block py-12 px-6 sm:px-12 max-w-[1280px]">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center pb-8">
          <Logo />
          <Menu menuItems={menuItems} />
        </div>
        <div className="pt-8 border-t border-[#E9DBCD]">
          <h3 className="text-[#1A0803] text-xl font-bold leading-tight font-[family-name:var(--font-pangram)] pb-3">
            Organize your recipes with Recify
          </h3>
          <div className="flex justify-between items-end">
            <p className="text-[#2C2726] font-[family-name:var(--font-inter)] text-base font-normal leading-relaxed max-w-md">
              Save and organize all your favorite recipes in one beautiful place.
            </p>
            <p className="text-[#7F7876] font-[family-name:var(--font-inter)] text-sm font-normal">
              © 2024 Recify. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto sm:hidden pt-7 px-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-6">
            <Logo />
            <h3 className="text-[#1A0803] text-base font-bold leading-tight font-[family-name:var(--font-pangram)]">
              Organize your recipes with Recify
            </h3>
            <p className="text-[#2C2726] font-[family-name:var(--font-inter)] text-sm font-normal leading-relaxed">
              Save and organize all your favorite recipes in one beautiful place.
            </p>
          </div>
          <div className="min-w-[100px]">
            <Menu menuItems={menuItems} />
          </div>
        </div>
        <p className="text-[#7F7876] font-[family-name:var(--font-inter)] text-center text-sm font-normal py-11">
          © 2024 Recify. All rights reserved. <br />
          <span className="mt-1"> Icons by Icons8</span>
        </p>
      </div>
    </>
  );
};

export default Footer;
