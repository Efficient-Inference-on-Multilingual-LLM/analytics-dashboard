import React from 'react'

interface SectionProps {
  title: string;
  children: React.ReactNode;
  outerClassName?: string;
  innerClassName?: string;
}

const Section = ({ title, children, outerClassName, innerClassName }: SectionProps) => {
  return (
    <section className={`flex flex-col gap-4 ${outerClassName || ''}`}>
        <span className='font-bold uppercase text-lg tracking-wide'>{title}</span>
        <div className={`flex flex-col gap-3 ${innerClassName || ''}`}>
            {children}
        </div>
    </section>
  )
}

export default Section