import { ViewType } from "../components/ViewSelector";

const VIEW_PREFERENCE_KEY = 'viewPreference';

export const getStoredViewPreference = (): ViewType => {
    if (typeof window === 'undefined') return 'list';
    return (localStorage.getItem(VIEW_PREFERENCE_KEY) as ViewType) || 'list';
};

export const setStoredViewPreference = (view: ViewType) => {
    localStorage.setItem(VIEW_PREFERENCE_KEY, view);
};
