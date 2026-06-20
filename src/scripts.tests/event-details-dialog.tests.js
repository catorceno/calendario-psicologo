import assert from "node:assert/strict";
import { fillEventDetailsDialog } from "../scripts/event-details-dialog.js";

function buildEventDetailsContainer(){
  const container = document.createElement("div");
  container.innerHTML = `
    <div data-event-details>
      <div data-event-details-title></div>
      <div data-event-details-date></div>
      <div data-event-details-start-time></div>
      <div data-event-details-end-time></div>
      <div data-event-details-email></div>
      <div data-event-details-phone></div>
      <div data-event-details-ci></div>
    </div>
  `;
  return container;
}

it("buildEventDetailsContainer_conAlias_nombreCompleto", () => {
  // Arrange
  const container = buildEventDetailsContainer();
  const event = {
    title: "Ines Orellana Enriquez",
    alias: "Inecita",
    email: "inesorellana@gmail.com",
    phone: "77999914",
    ci: "2398022",
    date: new Date(2026, 6, 1),
    startTime: 540,
    endTime: 600,
    color: "blue"
  };

  // Act
  fillEventDetailsDialog(container, event);

  // Assert
  const titleElement = container.querySelector("[data-event-details-title]");
  assert.equal(titleElement.textContent, "Ines Orellana Enriquez");
});

it("buildEventDetailsContainer_sinAlias_nombreCompleto", () => {
  // Arrange
  const container = buildEventDetailsContainer();
  const event = {
    title: "Ines Orellana Enriquez",
    alias: "",
    email: "inesorellana@gmail.com",
    phone: "77999914",
    ci: "2398022",
    date: new Date(2026, 6, 1),
    startTime: 540,
    endTime: 600,
    color: "blue"
  };

  // Act
  fillEventDetailsDialog(container, event);

  // Assert
  const titleElement = container.querySelector("[data-event-details-title]");
  assert.equal(titleElement.textContent, "Ines Orellana Enriquez");
});