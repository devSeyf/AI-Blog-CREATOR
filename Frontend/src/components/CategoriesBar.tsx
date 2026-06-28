const categories = ["all", "Technology", "Startup", "Lifestyle", "Finance"];

interface CategoriesBarProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoriesBar({
  selectedCategory,
  onSelect,
}: CategoriesBarProps) {
  return (
    <div className="flex w-full flex-wrap justify-center gap-2" aria-label="Blog categories">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(category)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 ${
              isSelected
                ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
