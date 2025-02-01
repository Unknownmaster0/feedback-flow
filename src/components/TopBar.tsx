"use client";
export const TopBar = function ({
  label,
  text,
  to,
}: {
  label: string;
  text: string;
  to: string;
}) {
  return (
    <div className="space-y-2">
      <div className="font-medium text-3xl text-black">{label}</div>
      <div className="text-lg sm:text-2xl sm:font-bold text-slate-800">
        {text}
        {to}
      </div>
    </div>
  );
};
