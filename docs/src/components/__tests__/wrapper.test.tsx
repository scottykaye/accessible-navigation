import Wrapper from '../ui/wrapper'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Wrapper', () => {
  test('renders a Wrapper', () => {
    render(<Wrapper>test</Wrapper>)
    screen.getByText('test')
  })
})
