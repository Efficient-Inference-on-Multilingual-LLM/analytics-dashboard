import React from "react";

const AnalysisLayout = ({
  children,
  filters,
}: {
  children: React.ReactNode;
  filters: React.ReactNode;
}) => {
  return (
    <div className="flex h-full overflow-hidden min-h-0">
      <aside className="w-80 shrink-0 overflow-y-auto no-scrollbar border-r p-4">
        {filters}
      </aside>
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0">{children}</div>
    </div>
  );
};

export default AnalysisLayout;
