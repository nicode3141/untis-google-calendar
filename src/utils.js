export function getWeeksMonday() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(today);

  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

export function getWeeksSunday() {
  const sunday = new Date(getWeeksMonday());
  sunday.setDate(getWeeksMonday().getDate() + 6);
  sunday.setHours(23, 59);

  return sunday;
}
