import {IMacroAdviceAction} from "../actions";
import {IMacroAdvice,} from "../models";
import {MacroAdviceActionTypes} from "../actions";
import {mockMacroAdviceData} from "../models/MockData";

// TODO:: Remove initial state
const initialState: IMacroAdvice = mockMacroAdviceData;

export const macroAdviceReducer = (state: IMacroAdvice = initialState, action: IMacroAdviceAction) => {
    switch (action.type) {
        case MacroAdviceActionTypes.SET_MACRO_ADVICE: {
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
