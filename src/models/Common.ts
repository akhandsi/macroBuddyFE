import {IColorConfig} from "../utils";

export interface IComparisonData {
    name: string;
    colorConfig: IColorConfig;
    current: number;
    suggested: number;
}
