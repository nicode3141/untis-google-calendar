import { WebUntis } from "webuntis";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export class Untis {
  #untis;

  constructor() {
    this.#untis = new WebUntis(
      "ottheinrich-gym wiesloch",
      process.env.UNTIS_USER ?? "",
      process.env.UNTIS_SECRET ?? "",
      "mese.webuntis.com/"
    );
  }

  async getWeekTimetable() {
    const start = new Date(2025, 8, 15, 10, 3, 30);
    const end = new Date(2025, 8, 30, 10, 3, 30);

    console.log(start.toISOString());

    await this.#untis.login();
    const timetable = await this.#untis.getOwnTimetableForWeek(start);

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

    return timetable;
  }

  async getDayTimetable(date) {
    this.#untis.login();
    return await this.#untis.getOwnTimetableFor(date);
  }

  async getChanges() {}

  async getFormattedTimetable() {
    let day = new Date();
    let d = day.getDay();
    let diff = day.getDate() - d + (d === 0 ? -6 : 1);
    let monday = new Date(diff);
    console.log(monday.toISOString());

    for (let i = 0; i < 5; i++) {
      day++;
      await this.getDayTimetable(monday);
    }
  }
}
