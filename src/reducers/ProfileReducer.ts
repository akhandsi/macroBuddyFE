import {IProfileAction, ProfileActionTypes} from "../actions";
import {IUserProfile} from "../models";
import {mockProfileData} from "../models/MockData";

// TODO:: Remove initial state
const initialState: IUserProfile = mockProfileData;

export const profileReducer = (state: IUserProfile = initialState, action: IProfileAction) => {
    switch (action.type) {
        case ProfileActionTypes.SET_PROFILE: {
            return {
                ...state,
                ...action.payload
            };
        }
        default: {
            return state;
        }
    }
};
