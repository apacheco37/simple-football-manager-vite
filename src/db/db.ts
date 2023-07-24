import Dexie, { Table } from "dexie";

export interface League {
  id?: number;
  name: string;
  teams: Team[];
  players: Player[];
}

export interface Team {
  id: number;
  name: string;
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  skill: number;
  position: Position;
  teamID: number | null;
}

export const ALL_POSITIONS = [
  "GK",
  "DFC",
  "DFL",
  "DFR",
  "MFC",
  "MFL",
  "MFR",
  "STC",
  "STL",
  "STR",
] as const;
export type Position = (typeof ALL_POSITIONS)[number];

export class DexieDB extends Dexie {
  leagues!: Table<League>;

  constructor() {
    super("simple-fm-db");
    this.version(3).stores({
      leagues: "++id",
    });
  }
}

export const db = new DexieDB();
