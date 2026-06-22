import assert from "node:assert/strict";
import { getEventCardLabel, validateEvent } from "../scripts/event.js";

it("getEventCardLabel_aliasExistente_Exitoso", () => {
  // Arrange
  const event = {
    title: "Ines Orellana Enriquez",
    alias: "Inecita"
  };

  // Act
  const cardLabel = getEventCardLabel(event);

  // Assert
  assert.equal(cardLabel, "Inecita");
});

it("getEventCardLabel_aliasInexistente_Exitoso", () => {
  // Arrange
  const event = {
    title: "Ines Orellana Enriquez",
    alias: ""
  };

  // Act
  const cardLabel = getEventCardLabel(event);

  // Assert
  assert.equal(cardLabel, "Ines Orellana Enriquez");
});

const validEvent = {
  title: "Ines Orellana",
  ci: "8673021",
  email: "inesorellana@gmail.com",
  phone: "77999914",
  startTime: "09:00",
  endTime: "10:00",
};

it("validateEvent_emailVacio_Fallido", () => {
  // Arrange
  const event = { ...validEvent, email: "" };

  // Act
  const result = validateEvent(event);

  // Assert
  assert.equal(result, "Email is required");
});

it("validateEvent_camposObligatorios_Exitoso", () => {
  // Arrange
  const event = { ...validEvent };

  // Act
  const result = validateEvent(event);

  // Assert
  assert.equal(result, null);
});