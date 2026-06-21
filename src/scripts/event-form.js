import { validateEvent, generateEventId } from "./event.js";

export function initEventForm(toaster) {
  const formElement = document.querySelector("[data-event-form]");

  let mode = "create";
  let originalEvent = null;

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    const formEvent = formIntoEvent(formElement);
    const validationError = validateEvent(formEvent);
    if (validationError !== null) {
      toaster.error(validationError);
      return;
    }

    if (mode === "create") {
      formElement.dispatchEvent(new CustomEvent("event-create", {
        detail: {
          event: formEvent
        },
        bubbles: true
      }));
    }

    if (mode === "edit") {
      formElement.dispatchEvent(new CustomEvent("event-edit", {
        detail: {
          event: formEvent,
          previousEvent: originalEvent
        },
        bubbles: true
      }));
    }
  });

  return {
    formElement,
    switchToCreateMode(date, startTime, endTime) {
      mode = "create";
      fillFormWithDate(formElement, date, startTime, endTime);
    },
    switchToEditMode(event) {
      mode = "edit";
      originalEvent = event;
      fillFormWithEvent(formElement, event);
    },
    reset() {
      originalEvent = null;
      formElement.querySelector("#id").value = null;
      formElement.reset();
    }
  };
}

function fillFormWithDate(formElement, date, startTime, endTime) {
  const dateInputElement = formElement.querySelector("#date");
  const startTimeSelectElement = formElement.querySelector("#start-time");
  const endTimeSelectElement = formElement.querySelector("#end-time");

  dateInputElement.value = formatDateForInput(date);
  startTimeSelectElement.value = startTime;
  endTimeSelectElement.value = endTime;
}

function fillFormWithEvent(formElement, event) {
  const idInputElement = formElement.querySelector("#id");
  const titleInputElement = formElement.querySelector("#title");
  const emailInputElement = formElement.querySelector("#email");
  const phoneInputElement = formElement.querySelector("#phone");
  const ciInputElement = formElement.querySelector("#ci");
  const dateInputElement = formElement.querySelector("#date");
  const startTimeSelectElement = formElement.querySelector("#start-time");
  const endTimeSelectElement = formElement.querySelector("#end-time");
  const colorInputElement = formElement.querySelector(`[value='${event.color}']`);

  idInputElement.value = event.id;
  titleInputElement.value = event.title;
  emailInputElement.value = event.email || "";
  phoneInputElement.value = event.phone || "";
  ciInputElement.value = event.ci || "";
  dateInputElement.value = formatDateForInput(event.date);
  startTimeSelectElement.value = event.startTime;
  endTimeSelectElement.value = event.endTime;
  colorInputElement.checked = true;
}

function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formIntoEvent(formElement) {
  const formData = new FormData(formElement);
  const id = formData.get("id");
  const title = formData.get("title");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const ci = formData.get("ci");
  const date = formData.get("date");
  const startTime = formData.get("start-time");
  const endTime = formData.get("end-time");
  const color = formData.get("color");

  // Use a local date (midnight in the user's timezone).
  // `new Date("YYYY-MM-DD")` is treated as UTC and can shift the day based on timezone.
  const [year, month, day] = date.split("-");
  const localDate = new Date(Number(year), Number(month) - 1, Number(day));

  const event = {
    id: id ? Number.parseInt(id, 10) : generateEventId(),
    title,
    email,
    phone,
    ci,
    date: localDate,
    startTime: Number.parseInt(startTime, 10),
    endTime: Number.parseInt(endTime, 10),
    color
  };

  return event;
}