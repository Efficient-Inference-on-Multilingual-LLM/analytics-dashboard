import Section from '@/components/filter/section'
import MethodSelector from '@/components/filter/method-selector'
import React from 'react'
import ModelGroup from '@/components/filter/model-group'
import GroupBy from '@/components/filter/group-by'

const CrossModelFilters = () => {
  return (
    <Section title="Cross-Model Filters">
      <MethodSelector />
      <ModelGroup label="Model A" />
      <ModelGroup label="Model B" />
      <GroupBy />
    </Section>
  )
}

export default CrossModelFilters