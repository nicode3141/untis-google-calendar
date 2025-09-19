import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

export class GoogleCalendar {
  async auth() {
    const client = new google.auth.JWT(
      "nicolas.d.pfeifer@gmail.com",
      undefined,
      process.env.CALENDAR_CLIENT_SECRET,
      SCOPES
    );
  }
}

export async function auth() {}

export async function addEvent() {
  auth();
}
