import React from 'react'
import { render } from '@testing-library/react'
import Search from './Search'

test('renders Search component with the placeholder', () => {
  const { getByPlaceholderText } = render(<Search label='Flickr image search' placeholder='Search for image tags'/>)
  const placeholder = getByPlaceholderText('Search for image tags')
  expect(placeholder).toBeInTheDocument()
})
