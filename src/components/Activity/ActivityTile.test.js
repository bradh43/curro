import React from 'react';
import {render, screen} from '@testing-library/react';
import {ActivityTile} from './ActivityTile';

const mockActivityId = 'someActivityId';
const mockFullActivity = {
  id: mockActivityId,
  type: 'Run',
  distance: {
    value: 2,
    unit: 'mi'
  },
  duration: 600000,
  equpiment: {
    id: 'someId'
  },
  additionalInfo: {
    averageHeartRate: 60,
    elevationGain: 100,
    calories: 100
  }
};

const mockSetEditActivity = jest.fn();
const mockSetEditActivityId = jest.fn();
const mockSetEditActivityValues = jest.fn();
const mockSetOpenActivityDetailModal = jest.fn();
const mockSetSelectedActivity = jest.fn();

describe('Activity Tile - No Edit, Full Activity', () => {
  beforeEach(() => {
    render(
      <ActivityTile
        activity={mockFullActivity}
        edit={false}
        setEditActivity={mockSetEditActivity}
        setEditActivityId={mockSetEditActivityId}
        setEditActivityValues={mockSetEditActivityValues}
        setOpenActivityDetailModal={mockSetOpenActivityDetailModal}
        setSelectedActivity={mockSetSelectedActivity}
      />
    )
  });
  
  it('should not show the Edit tooltip', () => {
    expect(screen.queryByTitle('Edit Activity')).not.toBeInTheDocument();
  });
});

describe('Activity Tile - Edit, No Activity', () => {
  beforeEach(() => {
    render(
      <ActivityTile
        activity={mockFullActivity}
        edit={false}
        setEditActivity={mockSetEditActivity}
        setEditActivityId={mockSetEditActivityId}
        setEditActivityValues={mockSetEditActivityValues}
        setOpenActivityDetailModal={mockSetOpenActivityDetailModal}
        setSelectedActivity={mockSetSelectedActivity}
      />
    )
  });
  
  it('should not show the Edit tooltip', () => {
    expect(screen.queryByTitle('Edit Activity')).not.toBeInTheDocument();
  });
});

describe('Activity Tile - Edit', () => {
  beforeEach(() => {
    render(
      <ActivityTile
        activity={mockFullActivity}
        edit={true}
        setEditActivity={mockSetEditActivity}
        setEditActivityId={mockSetEditActivityId}
        setEditActivityValues={mockSetEditActivityValues}
        setOpenActivityDetailModal={mockSetOpenActivityDetailModal}
        setSelectedActivity={mockSetSelectedActivity}
      />
    )
  });
  
  it('should show the Edit tooltip', () => {
    expect(screen.queryByTitle('Edit Activity')).toBeInTheDocument();
  });});