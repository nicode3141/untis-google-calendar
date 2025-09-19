import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import dotenv from "dotenv";
import { getWeeksMonday, getWeeksSunday } from "./utils.js";
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

  async deleteWeek() {
    const events = await this.#calendar.events.list({
      calendarId: this.#calendarId,
      timeMin: getWeeksMonday().toISOString(),
      timeMax: getWeeksSunday().toISOString(),
      singleEvents: true,
    });

    for (const item of events.data.items) {
      if (!item.id) continue;
      console.log(item);
      await this.#calendar.events.delete({
        eventId: item.id,
        calendarId: this.#calendarId,
      });
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
