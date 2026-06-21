const EMAILJS_PUBLIC_KEY = "nu270i3G7l2ijN4oe";
const EMAILJS_SERVICE_ID = "service_u4mn6ka";
const EMAILJS_TEMPLATE_ID = "template_p1uzygm";
const EMAILJS_URL_API = "https://api.emailjs.com/api/v1.0/email/send";

const dateFormatter = new Intl.DateTimeFormat("es-BO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("es-BO", {
  hour: "numeric",
  minute: "numeric",
});

function eventTimeToDate(event, minutes){
  return new Date(
    event.date.getFullYear(),
    event.date.getMonth(),
    event.date.getDate(),
    0,
    minutes
  );
}

function buildTemplateParams(event, extraParams = {}){
  return {
    to_email: event.email,
    patient_name: event.title,
    date: dateFormatter.format(event.date),
    start_time: timeFormatter.format(eventTimeToDate(event, event.startTime)),
    end_time: timeFormatter.format(eventTimeToDate(event, event.endTime)),
    ...extraParams,
  };
}

async function sendEmail(templateParams, fetchImpl = fetch){
  const payload = {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: templateParams,
  };

  const response = await fetchImpl(EMAILJS_URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if(!response.ok){
    throw new Error(`EmailJS error: ${response.status}`);
  }
}

const defaultDeps = { fetch }

export async function sendConfirmationEmail(event, deps = defaultDeps){
  const templateParams = buildTemplateParams(event, {
    subject: "Consulta Confirmada",
    mesage: "Tu cita ha sido agendada exitosamente en el horario indicado abajo.",
  });

  await sendEmail(templateParams, deps.fetch ?? fetch);
}