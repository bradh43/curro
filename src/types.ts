export type Distance = {
    value: number;
    unit: string;
}

export type Equipment = {
    id: string;
    type?: string;
    name?: string;
}

export type AdditionalInfo = {
    averageHeartRate: number;
    elevationGain: number;
    calories: number;
}

export type Activity = {
    id: string;
    activityId: number;
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
    distanceUnit: string;
    duration?: number;
    distanceValue?: number;
    equipmentId?: string;
    heartRate?: string;
    elevationGain?: string;
    calories?: string;
}
