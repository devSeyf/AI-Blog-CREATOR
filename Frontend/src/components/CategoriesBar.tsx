import React from "react";

function CategoriesBar({
  selectedCategory,
  onSelect,
}: {
  selectedCategory: string;
  onSelect: (c: string) => void;
}) {
  const categories = ["all", "Technology", "Startup", "Lifestyle", "Finance"];

  return (
    <div className="w-full flex flex-wrap gap-3 justify-center  mb-8 ">
      {categories?.map((cat) => (
        <button
          className={`px-4 py-2 rounded-full font-medium transition-all
                ${selectedCategory === cat ? "bg-linear-to-r from-sky-400 to-cyan-400  shadow-md " : " bg-sky-50 text-sky-700 hover:bg-sky-100"}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoriesBar;
