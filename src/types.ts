export type Distance = {
    value: number;
    unit: string;
}

export type Equipment = {
    id: string;
}

export type AdditionalInfo = {
    averageHeartRate: number;
    elevationGain: number;
    calories: number;
}

export type Activity = {
    id: string;
    activityId: string;
    type: string;
    duration?: number;
    distance?: Distance;
    additionalInfo?: AdditionalInfo;
    equipment?: Equipment;
    equipmentId?: string;
}

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

export type EditActivityValues = {
    duration: number;
    distanceValue: number;
    distanceUnit: string;
    equipmentId: string;
    averageHeartRate: string;
    elevationGain: string;
    calories: string;
}

