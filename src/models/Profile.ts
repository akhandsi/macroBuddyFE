export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export enum Goal {
    WEIGHT_LOSS = 'WEIGHT_LOSS',
    WEIGHT_GAIN = 'WEIGHT_GAIN',
}

export enum NumOfExerciseDays {
    ZERO=0,
    ONE=1,
    TWO=2,
    THREE=3,
    FOUR=4,
    FIVE=5,
    SIX=6,
    SEVEN=7
}

export enum NumOfMealsInADay {
    THREE=3,
    FIVE=5,
}

export interface IUserProfile {
    age?: number;
    gender?: Gender;
    numOfExerciseDays?: NumOfExerciseDays;
    numOfMealsInADay?: NumOfMealsInADay;
    bodyWeightInKGS?: number;
    bodyHeightInCMS?: number;
    bodyFatInPercentage?: number;
    goal?: Goal;
}
