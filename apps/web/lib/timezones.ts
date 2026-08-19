// IANA timezone names for the settings picker. Intl.supportedValuesOf is
// available in every browser we target; the fallback keeps the field usable in
// older ones instead of rendering an empty dropdown.
const FALLBACK = [
  "UTC",
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export function timezones(): string[] {
  if (typeof Intl.supportedValuesOf === "function") {
    return Intl.supportedValuesOf("timeZone");
  }
  return FALLBACK;
}

/** The visitor's own timezone, e.g. "Asia/Kolkata". */
export function localTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
