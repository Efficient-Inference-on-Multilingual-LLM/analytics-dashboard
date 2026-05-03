"use client";

import Section from '@/components/filter/section'
import MethodSelector from '@/components/filter/method-selector'
import React from 'react'
import ModelGroup from '@/components/filter/model-group'
import GroupBy from '@/components/filter/group-by'
import { Label } from '@/components/ui/label'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import MultiSelect from '@/components/ui/multi-select'
import { AGGREGATION_OPTIONS, MODELS } from '@/types/constant'


const CrossModelFilters = () => {
  type AggregationOption = (typeof AGGREGATION_OPTIONS)[number]

  return (
    <Section title="Cross-Model Filters">
      <MethodSelector />
      <ModelGroup label="Model A" />
      <ModelGroup label="Model B" />
      <MultiSelect 
        frameworks={ MODELS } 
        label="Models to Compare"
      />

      <GroupBy />

      <div>
        <Label className='text-sm px-1'>
          Aggregation
        </Label>
        <Combobox 
          items={AGGREGATION_OPTIONS} 
          itemToStringLabel={(item: AggregationOption) => item.label} 
          itemToStringValue={(item: AggregationOption) => item.value}
        >
          <ComboboxInput placeholder="Select an aggregation" showClear />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </Section>
  )
}

export default CrossModelFilters