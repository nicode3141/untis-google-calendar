import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export class GoogleCalendar {
  #client;
  #calendar;

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

  async addEvent(name, description, startDate, endDate) {
    this.#calendar.events.insert({
      calendarId:
        "3095c43e29089bc37869e4f29848a67dde2cbdcc39b65ac720ec62b835057982@group.calendar.google.com",
      resource: {
        summary: name,
        description: description,
        start: { dateTime: startDate, timeZone: "Europe/Berlin" },
        end: { dateTime: endDate, timeZone: "Europe/Berlin" },
      },
    });
  }
}
