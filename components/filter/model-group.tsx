import React from 'react'
import { MethodSelectorProps } from '@/types/filter'
import { Label } from '../ui/label'
import { MODELS, COMPONENTS } from '@/types/constant'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '../ui/select'

const ModelGroup = ({ label }: MethodSelectorProps) => {
  return (
    <div className='rounded-lg border border-border p-3 flex flex-col gap-3'>
        <div className='text-sm font-semibold uppercase tracking-wide'>
            {label}
        </div>
        <div>
            <Label className='text-sm px-1'>
                Model
            </Label>
                <Select>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {MODELS.map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                    {model.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
        </div>
        <div>
            <Label className='text-sm px-1'>
                Component
            </Label>
            <Select>
                <SelectTrigger className='w-full'>
                    <SelectValue placeholder="Select a component" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {COMPONENTS.map((component) => (
                            <SelectItem key={component.value} value={component.value}>
                                {component.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </div>
  )
}

export default ModelGroup