import React from 'react'
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent, SelectGroup } from "../ui/select"
import { Label } from "../ui/label"
import { METHODS } from '@/types/constant'


const MethodSelector = () => {
  return (
    <div className='flex flex-col w-full'>
        <Label className='text-sm px-1'>
            Method
        </Label>
        <Select>
          <SelectTrigger className='w-full'>
                <SelectValue placeholder="Select a method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {METHODS.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                        {method.label}
                    </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
        </Select>
    </div>
  )
}

export default MethodSelector