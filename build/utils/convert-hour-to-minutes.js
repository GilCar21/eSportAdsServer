"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHourToMinutes = void 0;
function convertHourToMinutes(hourString) {
    const [hours, minutes] = hourString.split(':').map(Number);
    const minutesAmount = (hours * 60) + minutes;
    return minutesAmount;
}
exports.convertHourToMinutes = convertHourToMinutes;
