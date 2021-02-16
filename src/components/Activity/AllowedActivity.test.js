import {AllowedActivity} from "./AllowedActivity";

describe('Simple, but AllowedActivity', () => {
  it('should have the right number of allowed activities', () => {
    expect(AllowedActivity).toHaveLength(9);
  });
});