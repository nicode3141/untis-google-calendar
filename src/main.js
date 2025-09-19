import { WebUntis } from "webuntis";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const untis = new WebUntis(
  "ottheinrich-gym wiesloch",
  process.env.UNTIS_USER ?? "",
  process.env.UNTIS_SECRET ?? "",
  "mese.webuntis.com/"
);

const start = new Date(2025, 8, 15, 10, 3, 30);
const end = new Date(2025, 8, 30, 10, 3, 30);

console.log(start.toISOString());

await untis.login();
const timetable = await untis.getOwnTimetableForWeek(start);

timetable.forEach((element) => {
  const date = element.date.toString();

  console.log(
    date.substring(0, 4) +
      " " +
      date.substring(4, 6) +
      " " +
      date.substring(6, 8)
  );
  console.log(element.startTime + " - " + element.endTime);
  console.log(element.subjects[0]?.element.longName);
  console.log("NEXT");
});
