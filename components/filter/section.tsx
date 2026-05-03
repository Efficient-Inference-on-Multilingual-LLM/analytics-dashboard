import React from 'react'
import { SectionProps } from '@/types/filter'

const Section = ({ title, children }: SectionProps) => {
  return (
    <section className="flex flex-col gap-4">
        <span className='font-bold uppercase text-lg'>{title}</span>
        <div>
            {children}
        </div>
    </section>
  )
}

export default Section