import React from 'react';
import {render, screen} from '@testing-library/react';
import {ActivityDetail} from './ActivityDetail';
import {MockedProvider} from "@apollo/client/testing";
import {ME_EQUIPMENT_QUERY} from "../../utils/graphql";

const mockActivityId = 'activityId';
const mockActivityData = [{
  id: mockActivityId
}];

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
          activityData={mockActivityData}
          editActivityId={mockActivityId}
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
  
  it('should display if we are loaded', async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(await screen.getByTitle('activityDetailModal')).toBeInTheDocument();
  });
});