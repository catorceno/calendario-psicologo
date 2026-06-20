import assert from "node:assert/strict";
import { getEventCardLabel } from "../scripts/event.js";

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
