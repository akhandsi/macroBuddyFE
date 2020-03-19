import {IMacroBreakdown} from "./MacroBreakdown";

export interface IMacroAdvice {
    bmrCalories: number;
    totalCalories: number;
    currentCalories: number;
    macros: IMacroBreakdown;
}
