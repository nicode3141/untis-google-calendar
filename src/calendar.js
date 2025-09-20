import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import dotenv from "dotenv";
import { getMonday, getSunday } from "./utils.js";
dotenv.config({ path: "../.env" });

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export class GoogleCalendar {
  #client;
  #calendar;
  #calendarId =
    "3095c43e29089bc37869e4f29848a67dde2cbdcc39b65ac720ec62b835057982@group.calendar.google.com";

  constructor() {
    this.#client = new google.auth.GoogleAuth({
      keyFile: "./service-account.json",
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    this.#calendar = google.calendar({
      version: "v3",
      auth: this.#client,
    });
  }

  async deleteWeek(date) {
    if (!date) date = new Date();

    const { monday } = getMonday(date);
    const { sunday } = getSunday(date);

    const events = await this.#calendar.events.list({
      calendarId: this.#calendarId,
      timeMin: monday.toISOString(),
      timeMax: sunday.toISOString(),
      singleEvents: true,
    });

    for (const item of events.data.items) {
      if (!item.id) continue;

      await this.#calendar.events.delete({
        eventId: item.id,
        calendarId: this.#calendarId,
      });
      console.log(`deleted event ${item.summary}`);
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  async addEvent(name, description, startDate, endDate) {
    this.#calendar.events.insert({
      calendarId: this.#calendarId,
      resource: {
        summary: name,
        description: description,
        start: { dateTime: startDate, timeZone: "Europe/Berlin" },
        end: { dateTime: endDate, timeZone: "Europe/Berlin" },
      },
    });
  }
}
