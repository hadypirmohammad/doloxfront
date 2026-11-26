import Link from "next/link";
import React from "react";
import { getBrandBlogUrl, getTechSpecificItems } from "@/utils/techSpecific";

const TechSpecificDetail = ({ ad }) => {
  const items = getTechSpecificItems(ad, 4);
  if (!items.length) return null;

  const blogUrl = getBrandBlogUrl(ad?.Brand);

  return (
    <div className="bg-white rounded-[15px] w-full h-fit p-6 mt-2 max-w-screen-sm">
      <h2 className="text-center text-lg font-bold pb-4">مشخصات فنی</h2>

      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={`text-center min-w-0 ${items.length === 1 ? 'col-span-2' : ''}`}
          >
            <p className="text-sm text-gray-500 !font-[vazir]">{item.name}</p>
            <p className="text-sm text-black pt-1 break-words !font-[vazir]">{item.measure}</p>
          </div>
        ))}
      </div>

      {blogUrl ? (
        <div className="flex justify-center pt-5">
          <Link
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary text-sm font-bold hover:opacity-80 transition-opacity"
          >
            <span className="font-[vazir]">اطلاعات بیشتر</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="11"
              viewBox="0 0 19 11"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 5.5H17M17 5.5L12.5 1M17 5.5L12.5 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default TechSpecificDetail;
