import * as React from 'react'
import { render } from '@testing-library/react'

import 'jest-canvas-mock'

import { Slide } from '../src'

describe('Slide Render', () => {
  it('renders without crashing', () => {
    render(<Slide>First</Slide>)
  })
})
