import assert from "node:assert/strict";
import { sendConfirmationEmail } from "../scripts/email-notifier.js";

function createFakeFetch(){
  const calls = [];

  const fakeFetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, status: 200 };
  };

  fakeFetch.calls = calls;
  return fakeFetch;
}

it("sendConfirmationEmail_correoValido_Exitoso", async () => {
  // Arrange
  const fakeFetch = createFakeFetch();
  const event = {
    title: "Ines Orellana",
    email: "inesorellana@gmail.com",
    date: new Date(2026, 6, 1),
    startTime: 540,
    endTime: 600
  };

  // Act
  await sendConfirmationEmail(event, { fetch: fakeFetch });

  // Assert
  assert.equal(fakeFetch.calls.length, 1);
  const sentBody = JSON.parse(fakeFetch.calls[0].options.body);
  assert.equal(sentBody.template_params.to_email, "inesorellana@gmail.com");
  assert.equal(sentBody.template_params.patient_name, "Ines Orellana");
  assert.match(sentBody.template_params.start_time, /9:00.*m\.?/i);
  assert.match(sentBody.template_params.end_time, /10:00.*m\.?/i);
});
