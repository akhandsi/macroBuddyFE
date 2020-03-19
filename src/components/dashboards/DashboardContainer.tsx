import React from 'react';
import HomeDashboard from "./HomeDashboard";
import MealsDashboard from "./MealsDashboard";
import FoodLogDashboard from "./FoodLogDashboard";

interface IHomeDashboardProps {
    currentTabIndex: number;
}

/**
 * Get Dashboard item based on selected tab index.
 *
 * @param currentTabIndex current selected tab index
 */
function GetDashboardItem(currentTabIndex: number) {
    switch(currentTabIndex) {
        case 0:
            return <HomeDashboard/>;
        case 1:
            return <MealsDashboard/>;
        case 2:
            return <FoodLogDashboard/>;
        default:
            return null;
    }
}

/**
 * Dashboard Container that contains all different dashboard.
 * At given time only the active dashboard is visible. A dashboard is active if the tab index matches the dashboard title.
 *
 * @param props home dashboard props
 */
export default function DashboardContainer(props: IHomeDashboardProps) {
    return (
        <div>
            {GetDashboardItem(props.currentTabIndex)}
        </div>
    );
}
