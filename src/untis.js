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
    await this.#untis.login();
    return await this.#untis.getOwnTimetableFor(date);
  }

  #processTimes(time) {
    let hour = Math.floor(time / 100);
    let minute = time % 100;

    return { hour, minute };
  }

  #processTimetableArray(timetable) {
    let formattedTimetable = [];
    timetable.forEach((e, i) => {
      let startTime = this.#processTimes(e.startTime);
      let endTime = this.#processTimes(e.endTime);

      let shortName = e.su[0]?.name;
      let name = e.su[0]?.longname;

      let room = e.ro[0]?.name;
      formattedTimetable.push({ startTime, endTime, shortName, name, room });
    });

    return formattedTimetable;
  }

  async getChanges() {}

  async getFormattedTimetable() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diff);

    for (let i = 0; i < 5; i++) {
      monday.setDate(diff + i);
      console.log(`\x1b[4m${monday.toDateString()}\x1b[0m`);

      const timetable = await this.getDayTimetable(monday);
      return this.#processTimetableArray(timetable);
    }
  }
}
