import React, { ReactNode } from 'react'

export interface IFullPageProps {
  afterChange?: (params: { from: number; to: number }) => void
  beforeChange?: (params: { from: number; to: number }) => void
  children: ReactNode
  controls?: boolean | React.ComponentType<any>
  controlsProps?: Record<string, any>
  style?: React.CSSProperties
  duration?: number
  initialSlide?: number
  scrollMode?: string
}
