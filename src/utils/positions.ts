import { Position } from "../db/db";

export const calculatePlayerSkillInPosition = (
  playerSkill: number,
  playerPosition: Position,
  lineupPosition: Position
) => {
  if (playerPosition === lineupPosition) {
    return playerSkill;
  }
  if (playerPosition !== "GK" && lineupPosition === "GK") {
    return playerSkill * 0.2;
  }

  switch (playerPosition) {
    case "GK":
      if (["DF-C", "DF-L", "DF-R"].includes(lineupPosition)) {
        return playerSkill * 0.5;
      }
      return playerSkill * 0.2;
    case "DF-C":
      if (["DF-R", "DF-L"].includes(lineupPosition)) {
        return playerSkill * 0.9;
      }
      if (lineupPosition === "MF-C") {
        return playerSkill * 0.8;
      }
      return playerSkill * 0.5;
    case "DF-L":
      if (["DF-C", "MF-L"].includes(lineupPosition)) {
        return playerSkill * 0.9;
      }
      return playerSkill * 0.5;
    case "DF-R":
      if (["DF-C", "MF-R"].includes(lineupPosition)) {
        return playerSkill * 0.9;
      }
      return playerSkill * 0.5;
    case "MF-C":
      if (["MF-L", "MF-R"].includes(lineupPosition)) {
        return playerSkill * 0.9;
      }
      if (["DF-C", "ST-C"].includes(lineupPosition)) {
        return playerSkill * 0.8;
      }
      return playerSkill * 0.5;
    case "MF-L":
      if (["ST-L", "MF-R", "DF-L"].includes(lineupPosition)) {
        return playerSkill * 0.9;
      }
      if (["MF-C"].includes(lineupPosition)) {
        return playerSkill * 0.8;
      }
      return playerSkill * 0.5;
    case "MF-R":
      if (["ST-R", "MF-L", "DF-R"].includes(lineupPosition)) {
        return playerSkill * 0.9;
      }
      if (["MF-C"].includes(lineupPosition)) {
        return playerSkill * 0.8;
      }
      return playerSkill * 0.5;
    case "ST-C":
      if (["ST-R", "ST-C"].includes(lineupPosition)) {
        return playerSkill * 0.9;
      }
      if (["MF-C"].includes(lineupPosition)) {
        return playerSkill * 0.8;
      }
      return playerSkill * 0.5;
    case "ST-L":
      if (["ST-R", "ST-C", "MF-L"].includes(lineupPosition)) {
        return playerSkill * 0.9;
      }
      if (["MF-R"].includes(lineupPosition)) {
        return playerSkill * 0.8;
      }
      return playerSkill * 0.5;
    case "ST-R":
      if (["ST-L", "ST-C", "MF-R"].includes(lineupPosition)) {
        return playerSkill * 0.9;
      }
      if (["MF-L"].includes(lineupPosition)) {
        return playerSkill * 0.8;
      }
      return playerSkill * 0.5;
    default:
      throw new Error("Error calculating player skill in position");
  }
};
