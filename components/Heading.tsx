import React from "react";

const Heading = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <div className="text-center max-w-2xl mx-auto mb-10 px-4">
      <h2 className="text-slate-900 text-3xl sm:text-4xl font-extrabold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2.5 text-slate-500 text-sm sm:text-base">{subtitle}</p>
      )}
    </div>
  );
};

export default Heading;
