import {IMacroAdvice} from "../models";

export enum MacroAdviceActionTypes {
    SET_MACRO_ADVICE = "SET_MACRO_ADVICE",
}

export interface IMacroAdviceAction {
    type: MacroAdviceActionTypes,
    payload: IMacroAdvice | null
}
