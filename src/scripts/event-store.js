import { isTheSameDay } from "./date.js";
import { sendConfirmationEmail, sendRescheduledEmail } from "./email-notifier.js";

// Update these with your Supabase project details.
// NOTE: The public key is visible in frontend code.
const SUPABASE_URL = "https://njpuetvvubjdrxcmbumk.supabase.co";
const SUPABASE_KEY = "sb_publishable_OO9I-iJqZvNiIVrL51SrrA_TVzkxG4F";
const DEFAULT_PSYCHOLOGIST_ID = 1;

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: "public"
  }
});

export function initEventStore({ psychologistId = DEFAULT_PSYCHOLOGIST_ID } = {}) {
  let events = [];

  loadEventsFromSupabase();

  document.addEventListener("event-create", async (event) => {
    const createdEvent = event.detail.event;

    const appointment = mapEventToAppointment(createdEvent, psychologistId);
    const { data, error } = await supabaseClient
      .from("appointments")
      .insert(appointment)
      .select()
      .single();

    if (error) {
      console.error("Create appointment failed", error);
      return;
    }

    events.push(mapAppointmentToEvent(data));

    sendConfirmationEmail(createdEvent).catch((error) => {
      console.error("Confirmation email failed", error);
    });

    document.dispatchEvent(new CustomEvent("events-change", {
      bubbles: true
    }));
  });

  document.addEventListener("event-delete", async (event) => {
    const deletedEvent = event.detail.event;

    const { error } = await supabaseClient
      .from("appointments")
      .delete()
      .eq("id", deletedEvent.id)
      .eq("psychologist_id", psychologistId);

    if (error) {
      console.error("Delete appointment failed", error);
      return;
    }

    events = events.filter((event) => event.id !== deletedEvent.id);

    document.dispatchEvent(new CustomEvent("events-change", {
      bubbles: true
    }));
  });

  document.addEventListener("event-edit", async (event) => {
    const editedEvent = event.detail.event;
    const previousEvent = event.detail.previousEvent;

    const appointment = mapEventToAppointment(editedEvent, psychologistId);
    const { data, error } = await supabaseClient
      .from("appointments")
      .update(appointment)
      .eq("id", editedEvent.id)
      .eq("psychologist_id", psychologistId)
      .select()
      .single();

    if (error) {
      console.error("Update appointment failed", error);
      return;
    }

    events = events.map((event) => {
      return event.id === editedEvent.id ? mapAppointmentToEvent(data) : event;
    });

    const wasRescheduled = previousEvent && (
      previousEvent.startTime !== editedEvent.startTime ||
      previousEvent.endTime !== editedEvent.endTime ||
      previousEvent.date?.getTime() !== editedEvent.date?.getTime()
    );

    if(wasRescheduled){
      sendRescheduledEmail(editedEvent).catch((error) => {
        console.error("Rescheduled email failed", error);
      });
    }

    document.dispatchEvent(new CustomEvent("events-change", {
      bubbles: true
    }));
  });

  return {
    getEventsByDate(date) {
      const filteredEvents = events.filter((event) => isTheSameDay(event.date, date));

      return filteredEvents;
    }
  };

  async function loadEventsFromSupabase() {
    const { data, error } = await supabaseClient
      .from("appointments")
      .select("*")
      .eq("psychologist_id", psychologistId);

    if (error) {
      console.error("Load appointments failed", error);
      return;
    }

    events = data.map(mapAppointmentToEvent);

    document.dispatchEvent(new CustomEvent("events-change", {
      bubbles: true
    }));
  }
}

function mapEventToAppointment(event, psychologistId) {
  return {
    psychologist_id: psychologistId,
    pacientName: event.title,
    email: event.email,
    phone: event.phone,
    ci: event.ci,
    date: formatDateForSupabase(event.date),
    startTime: minutesToTimeString(event.startTime),
    endTime: minutesToTimeString(event.endTime),
    color: event.color
  };
}

function mapAppointmentToEvent(appointment) {
  return {
    id: appointment.id,
    title: appointment.pacientName,
    email: appointment.email,
    phone: appointment.phone,
    ci: appointment.ci,
    date: new Date(`${appointment.date}T00:00:00`),
    startTime: timeStringToMinutes(appointment.startTime),
    endTime: timeStringToMinutes(appointment.endTime),
    color: appointment.color
  };
}

function formatDateForSupabase(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function minutesToTimeString(minutes) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mins = String(minutes % 60).padStart(2, "0");

  return `${hours}:${mins}:00`;
}

function timeStringToMinutes(timeString) {
  if (typeof timeString !== "string") {
    return 0;
  }

  const [hours, minutes] = timeString.split(":");
  return Number.parseInt(hours, 10) * 60 + Number.parseInt(minutes, 10);
}

/*
function getEventsFromLocalStorage() {
  const localStorageEvents = localStorage.getItem("events");
  if (localStorageEvents === null) {
    return [];
  }

  let parsedEvents;
  try {
    parsedEvents = JSON.parse(localStorageEvents);
  } catch (error) {
    console.error("Parse events failed", error);
    return [];
  }

  const events = parsedEvents.map((event) => ({
    ...event,
    date: new Date(event.date)
  }));

  return events;
}
*/