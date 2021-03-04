import React from 'react';
import {render, screen} from '@testing-library/react';
import {ActivityDetail} from './ActivityDetail';
import {MockedProvider} from "@apollo/client/testing";
import {ME_EQUIPMENT_QUERY} from "../../utils/graphql";
import {Activity, AllowedActivityType, EditActivityValues} from "../../types";

const mockActivity: AllowedActivityType = {
  id: 1,
  type: 'Run',
  durationAllowed: true,
  distanceAllowed: true,
  equipmentAllowed: true,
  additionalInfoAllowed: true
};

const mockActivityData: Activity[] = [{
  id: 'someId',
  activityId: 2,
  type: 'Run'
}];

const mockEditActivityValues: EditActivityValues = {
  distanceUnit: 'mi'
};

const mocks = [
  {
    request: {
      query: ME_EQUIPMENT_QUERY
    },
    result: () => {
      console.log('Got into the query');
      return {
        data: {
          me: {
            foo: 'bar'
          }
        }
      }
    }
  }
];

describe('Activity Detail', () => {
  
  beforeEach(() => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ActivityDetail
          activity={mockActivity}
          activityData={mockActivityData}
          editActivity={true}
          editActivityId={'123'}
          editActivityValues={mockEditActivityValues}
          handleClose={jest.fn()}
          handleCloseSelect={jest.fn()}
          handleEditActivityChange={jest.fn()}
          handleEditActivityChangeSelect={jest.fn()}
          openModal={true}
          setActivityData={jest.fn()}
          setEditActivityDefaultValues={jest.fn()}
        />
      </MockedProvider>
    );
  });
  
  it('should not display if we are loading', () => {
    expect(screen.queryByTitle('activityDetailModal')).not.toBeInTheDocument();
  });
  
  it('should display some loading screen', () => {
    expect(screen.getByTitle('Loading Screen')).toBeInTheDocument();
  });
});