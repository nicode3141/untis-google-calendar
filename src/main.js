import { Untis } from "./untis.js";

const untis = new Untis();
const timetable = await untis.getFormattedTimetable();

console.log(timetable);
