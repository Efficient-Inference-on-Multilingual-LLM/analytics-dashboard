import React from 'react'
import { Label } from '../ui/label'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import { GROUP_BY_OPTIONS } from '@/types/constant'

const GroupBy = () => {
  type GroupByOption = (typeof GROUP_BY_OPTIONS)[number]
  return (
    <div>
        <Label className='text-sm px-1'>
            Group By
        </Label>
        <Combobox 
            items={GROUP_BY_OPTIONS} 
            itemToStringLabel={(item: GroupByOption) => item.label} 
            itemToStringValue={(item: GroupByOption) => item.value}
        >
            <ComboboxInput placeholder="Select grouping" showClear />
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
  )
}

export default GroupBy