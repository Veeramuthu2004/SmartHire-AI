"""
Frontend component tests for SmartHire AI
"""
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Button from '../src/components/Button'
import Card from '../src/components/Card'
import Input from '../src/components/Input'
import Alert from '../src/components/Alert'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    screen.getByText('Click me').click()
    expect(handleClick).toHaveBeenCalled()
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
  })
})

describe('Card Component', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('Input Component', () => {
  it('renders label', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders input field', () => {
    render(<Input type="email" placeholder="Enter email" />)
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Input error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })
})

describe('Alert Component', () => {
  it('renders alert message', () => {
    render(<Alert message="Success!" type="success" />)
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  it('applies correct styling for success', () => {
    const { container } = render(
      <Alert message="Success!" type="success" />
    )
    expect(container.firstChild).toHaveClass('bg-green-100')
  })

  it('applies correct styling for error', () => {
    const { container } = render(
      <Alert message="Error!" type="error" />
    )
    expect(container.firstChild).toHaveClass('bg-red-100')
  })
})
