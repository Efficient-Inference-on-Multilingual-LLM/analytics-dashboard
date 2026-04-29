import React from 'react'

const AnalysisLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
  return (
    <div className='flex min-h-full'>
        <div>
            The filters
        </div>
        <div className="overflow-auto">
            {children}
        </div>
    </div>
  )
}

export default AnalysisLayout