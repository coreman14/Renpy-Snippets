
import * as timeDelta from "time-delta";
// @ts-expect-error Locales are not marked as exported correctly, but we can still access all of them
import enLocale from "time-delta/locales/en";
timeDelta.addLocale(enLocale);
export const instance = timeDelta.create({
    locale: "en",
    span: 1,
    unitType: "long",
});

export function getTimeString(time1: number, time2: number) {
    let date1, date2;
    if (time1 < time2) {
        date1 = new Date(time1);
        date2 = new Date(time2);
    } 
    else {
        date1 = new Date(time2);
        date2 = new Date(time1);
    }
    return instance.format(date1, date2) || "0 seconds"; //It should always display a time
}
