export type AllowedActivityType = {
  id: number;
  type: string;
  durationAllowed: boolean;
  distanceAllowed: boolean;
  equipmentAllowed: string | boolean;
  equipmentName?: string;
  additionalInfoAllowed: boolean;
  defaultUnit?: string;
}

export const AllowedActivity: AllowedActivityType[] = [
  {
    id: 0,
    type: "Run",
    durationAllowed: true,
    distanceAllowed: true,
    equipmentAllowed: "Shoes",
    equipmentName: "SHOE",
    additionalInfoAllowed: true,
    defaultUnit: "mi"
  },
  {
    id: 1,
    type: "Bike",
    durationAllowed: true,
    distanceAllowed: true,
    equipmentAllowed: "Bikes",
    equipmentName: "BIKE",
    additionalInfoAllowed: true,
    defaultUnit: "mi"
  },
  {
    id: 2,
    type: "Swim",
    durationAllowed: true,
    distanceAllowed: true,
    equipmentAllowed: false,
    additionalInfoAllowed: true,
    defaultUnit: "yds"
  },
  {
    id: 3,
    type: "Sleep",
    durationAllowed: true,
    distanceAllowed: false,
    equipmentAllowed: false,
    additionalInfoAllowed: true
  },
  {
    id: 4,
    type: "Climb",
    durationAllowed: true,
    distanceAllowed: false,
    equipmentAllowed: false,
    additionalInfoAllowed: true
  },
  {
    id: 5,
    type: "AlterG",
    durationAllowed: true,
    distanceAllowed: true,
    equipmentAllowed: true,
    additionalInfoAllowed: true,
    defaultUnit: "mi"
  },
  {
    id: 6,
    type: "Yoga",
    durationAllowed: true,
    distanceAllowed: false,
    equipmentAllowed: false,
    additionalInfoAllowed: false
  },
  {
    id: 7,
    type: "Aqua Jog",
    durationAllowed: true,
    distanceAllowed: false,
    equipmentAllowed: false,
    additionalInfoAllowed: true
  },
  {
    id: 8,
    type: "Hike",
    durationAllowed: true,
    distanceAllowed: true,
    equipmentAllowed: "SHOE",
    additionalInfoAllowed: true,
    defaultUnit: "mi"
  }
];