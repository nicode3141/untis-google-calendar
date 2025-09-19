import fs from "fs";
import { Untis } from "./untis.js";

const untis = new Untis();
const timetable = await untis.getFormattedTimetable();

fs.writeFileSync(
  "./data/normalTimetableMerged.json",
  JSON.stringify(timetable),
  null,
  (err) => {
    console.log(err);
  }
);
