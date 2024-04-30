import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Description from '../Description'; 
import '@testing-library/jest-dom';

describe('Description Component', () => {
  it('renders the provided description text correctly', () => {
    const testDescription = 'This is a sample description for testing.';

    render(<Description description={testDescription} />);

    expect(screen.getByText(testDescription)).toBeInTheDocument();
  });
});
