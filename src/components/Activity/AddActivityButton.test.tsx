import React from 'react';
import {AddActivityButton} from "./AddActivityButton";
import {render, screen} from '@testing-library/react'
import userEvent from "@testing-library/user-event";

describe('AddActivityButton', () => {
  const mockOnClick = jest.fn();
  
  beforeEach(() => {
    render(<AddActivityButton
      openSelectActivity={mockOnClick}
    />)
  });
  
  it('should say Add Activity', () => {
    expect(screen.getByText('Add Activity')).toBeInTheDocument();
  });
  
  it('should call the correct callback', () => {
    userEvent.click(screen.getByTitle('openIcon'));
    expect(mockOnClick).toHaveBeenCalled();
  });
});