import React from 'react'

const AnalysisLayout = ({
    children,
    filters,
}: {
    children: React.ReactNode,
    filters: React.ReactNode,
}) => {
  return (
    <div className='flex min-h-full'>
        <aside className="w-80 shrink-0 overflow-y-auto border-r p-4">
            {filters}
        </aside>
        <div className="overflow-auto">
            {children}
        </div>
    </div>
  )
}

export default AnalysisLayout