import React from 'react'
import MultiSelect from '../ui/multi-select';
import { MODELS, COMPONENTS } from '@/types/constant';

interface MultiModelGroupProps {
    label: string;
}

const MultiModelGroup = ({ label }: MultiModelGroupProps) => {
  return (
    <div className='rounded-lg border border-border p-3 flex flex-col gap-3'>
        <div className='text-sm font-semibold uppercase tracking-wide'>
            {label}
        </div>
        <MultiSelect 
            frameworks={MODELS}
            label="Models to Compare"
            placeholder='Select models to compare'
        />
        <MultiSelect 
            frameworks={COMPONENTS}
            label="Components to Compare"
            placeholder='Select components to compare'
        />
    </div>
  )
}

export default MultiModelGroup