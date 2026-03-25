import { initMonthCalendar } from "./month-calendar.js";
import { initWeekCalendar } from "./week-calendar.js";
import { currentDeviceType } from "./responsive.js";
import { getUrlDate, getUrlView } from "./url.js";

export function initCalendar(eventStore) {
  const calendarElement = document.querySelector("[data-calendar]");

  let selectedView = getUrlView();
  let selectedDate = getUrlDate();
  let deviceType = currentDeviceType();

  function refreshCalendar() {
    let calendarScrollableElement = calendarElement.querySelector("[data-calendar-scrollable]");

    const scrollTop = calendarScrollableElement === null ? 0 : calendarScrollableElement.scrollTop;

    calendarElement.replaceChildren();

    if (selectedView === "month") {
      initMonthCalendar(calendarElement, selectedDate, eventStore);
    } else if (selectedView === "week") {
      initWeekCalendar(calendarElement, selectedDate, eventStore, false, deviceType);
    } else {
      initWeekCalendar(calendarElement, selectedDate, eventStore, true, deviceType);
    }

    calendarScrollableElement = calendarElement.querySelector("[data-calendar-scrollable]");
    calendarScrollableElement.scrollTo({ top: scrollTop });

    // On first load of the week view, scroll to a more useful time (9AM).
    // If the user already scrolled, we keep their position.
    if (selectedView === "week" && scrollTop === 0) {
      scrollToHour(calendarScrollableElement, 9);
    }
  }

  function scrollToHour(scrollableElement, hour) {
    const timeElements = Array.from(scrollableElement.querySelectorAll(".week-calendar__time"));
    const target = timeElements.find((element) => element.textContent.trim().startsWith(`${hour}:00`));

    if (!target) {
      return;
    }

    scrollableElement.scrollTop = target.offsetTop;
  }

  document.addEventListener("view-change", (event) => {
    selectedView = event.detail.view;
    refreshCalendar();
  });

  document.addEventListener("date-change", (event) => {
    selectedDate = event.detail.date;
    refreshCalendar();
  });

  document.addEventListener("device-type-change", (event) => {
    deviceType = event.detail.deviceType;
    refreshCalendar();
  });

  document.addEventListener("events-change", () => {
    refreshCalendar();
  });

  refreshCalendar();
}