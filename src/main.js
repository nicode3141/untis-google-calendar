import { Untis } from "./untis.js";
import { GoogleCalendar } from "./calendar.js";

const untis = new Untis();
const timetable = await untis.getFormattedTimetable();

console.log(timetable);

const calendar = new GoogleCalendar();

const today = new Date();
const dayOfWeek = today.getDay();

const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
const monday = new Date(today);
monday.setDate(diff);

for (let i = 0; i < timetable.length; i++) {
  monday.setDate(diff + i);
  console.log(`\x1b[4m Adding Events for ${monday.toDateString()}\x1b[0m`);

  const startTime = new Date(monday);
  const endTime = new Date(monday);

  const dayTimetable = timetable[i];

  for (const e of dayTimetable) {
    if (!e.room) continue;

    startTime.setHours(e.startTime.hour);
    startTime.setMinutes(e.startTime.minute);
    endTime.setHours(e.endTime.hour);
    endTime.setMinutes(e.endTime.minute);

    console.log(startTime.toISOString());

    try {
      await calendar.addEvent(
        e.name,
        `${e.room} - ${e.shortName}`,
        startTime.toISOString(),
        endTime.toISOString()
      );
      console.log(`Added Events for \x1b[4m\x1b[32m${e.name}\x1b[0m`);
      await new Promise((res) => setTimeout(res, 500));
    } catch (e) {
      console.error(e.message);
    }
  }
}
