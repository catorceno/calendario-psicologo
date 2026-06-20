import { getUrlDate } from "./url.js";
import { DEFAULT_START_EVENT_MINS, DEFAULT_END_EVENT_MINS } from "./time-constants.js";

export function initEventCreateButtons() {
  const buttonElements = document.querySelectorAll("[data-event-create-button]");

  for (const buttonElement of buttonElements) {
    initEventCreateButton(buttonElement);
  }
}

function initEventCreateButton(buttonElement) {
  let selectedDate = getUrlDate();

  buttonElement.addEventListener("click", () => {
    buttonElement.dispatchEvent(new CustomEvent("event-create-request", {
      detail: {
        date: selectedDate,
        startTime: DEFAULT_START_EVENT_MINS,
        endTime: DEFAULT_END_EVENT_MINS
      },
      bubbles: true
    }));
  });

  document.addEventListener("date-change", (event) => {
    selectedDate = event.detail.date;
  });
}