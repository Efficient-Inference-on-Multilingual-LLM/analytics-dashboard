import React from 'react'
import { Label } from '../ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '../ui/select'
import { GROUP_BY_OPTIONS } from '@/types/constant'

const GroupBy = () => {
  return (
    <div>
        <Label className='text-sm px-1'>
            Group By
        </Label>
        <Select>
            <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select a grouping" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {GROUP_BY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
  )
}

export default GroupBy