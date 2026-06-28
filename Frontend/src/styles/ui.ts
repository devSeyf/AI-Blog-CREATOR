const baseButton =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55";

export const buttonStyles = {
  primary: `${baseButton} bg-cyan-600 text-white shadow-sm hover:bg-cyan-700`,
  secondary: `${baseButton} border border-slate-300 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800`,
  danger: `${baseButton} bg-rose-600 text-white hover:bg-rose-700`,
  ghost: `${baseButton} text-slate-600 hover:bg-slate-100 hover:text-slate-900`,
};

export const fieldStyles =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100";

export const labelStyles =
  "mb-1.5 block text-sm font-semibold text-slate-700";

export const cardStyles =
  "rounded-2xl border border-slate-200 bg-white shadow-sm";

export const pageStyles = "mx-auto w-full max-w-7xl";

