import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer'; 
import '@testing-library/jest-dom';

// Describe the test suite
describe('Footer Component', () => {
  // Test case: checks if the footer image is rendered correctly
  it('renders the footer image correctly', () => {
    // Render the Footer component
    render(<Footer />);

    // Get the image by its alt text
    const footerImage = screen.getByAltText('Footer');

    // Assert that the image is in the document
    expect(footerImage).toBeInTheDocument();

    // Assert that the image source is correct
    expect(footerImage).toHaveAttribute('src', '/footerImage.png');
  });
});
