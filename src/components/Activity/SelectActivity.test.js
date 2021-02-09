import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import {SelectActivity} from "./SelectActivity";

const mockHandleClose = jest.fn();
const mockSetEditActivity = jest.fn();
const mockSetSelectedActivity = jest.fn();
const mockSetOpenActivityDetailModal = jest.fn();
const mockSetEditActivityValues = jest.fn();

const mockEditActivityValues = {
  distanceValue: '',
  distanceUnit: 'mi',
  duration: '',
  durationMs: 0,
  equipmentId: '',
  heartRate: '',
  elevationGain: '',
  calories: '',
};

describe('Select Activity - Closed Modal', () => {
  beforeEach(() => {
    render(<SelectActivity
      editActivityValues={mockEditActivityValues}
      setEditActivity={mockSetEditActivity}
      setSelectedActivity={mockSetSelectedActivity}
      setOpenActivityDetailModal={mockSetOpenActivityDetailModal}
      setEditActivityValues={mockSetEditActivityValues}
      handleClose={mockHandleClose}
      openModal={true}
    />)
  });
  
  it('should have the correct number of activities', () => {
    expect(screen.getAllByTitle('activityOption')).toHaveLength(9);
  });
  
  it('should call the correct close modal', () => {
    userEvent.click(screen.getByTitle('cancelButton'));
    expect(mockHandleClose).toHaveBeenCalled();
  });
  
  it('should close edit modal', () => {
    userEvent.click(screen.getByText('Yoga'));
    expect(mockSetEditActivity).toHaveBeenCalledWith(false);
  });
  
  it('should set the new activity', () => {
    userEvent.click(screen.getByText('Yoga'));
    expect(mockSetSelectedActivity).toHaveBeenCalled();
  });
  
  it('should open activity detail modal', () => {
    userEvent.click(screen.getByText('Yoga'));
    expect(mockSetOpenActivityDetailModal).toHaveBeenCalledWith(true);
  });
  
  it('should not edit activity values if there isn\'t a default unit', () => {
    userEvent.click(screen.getByText('Yoga'));
    expect(mockSetEditActivityValues).not.toHaveBeenCalled();
  });
  
  it('should call edit activity values if there is a default unit', () => {
    userEvent.click(screen.getByText('Run'));
    expect(mockSetEditActivityValues).toHaveBeenCalled();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('SelectActivity - Closed Modal', () => {
  beforeEach(() => {
    render(
      <SelectActivity
        editActivityValues={mockEditActivityValues}
        setEditActivity={mockSetEditActivity}
        setSelectedActivity={mockSetSelectedActivity}
        setOpenActivityDetailModal={mockSetOpenActivityDetailModal}
        setEditActivityValues={mockSetEditActivityValues}
        handleClose={mockHandleClose}
        openModal={false}
      />
    )
  });
  
  it('should not display any options', () => {
    expect(screen.queryByTitle('activityOption')).not.toBeInTheDocument();
  });
});