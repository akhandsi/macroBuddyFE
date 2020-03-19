export enum MacroType {
    PROTEIN= 'PROTEIN',
    CARBOHYDRATES= 'CARBOHYDRATES',
    FATS= 'FATS',
}
export interface IMacroBreakdown {
    protein: number;
    carbohydrates: number;
    fats: number;
}
