import Dexie, { Table } from "dexie";

export interface League {
  id?: number;
  name: string;
  teams: Team[];
}

export interface Team {
  id?: number;
  name: string;
  players: Player[];
}

export interface Player {
  id?: number;
  firstName: string;
  lastName: string;
  age: number;
  skill: number;
  position: Position;
}

export type Position =
  | "GK"
  | "DFC"
  | "DFL"
  | "DFR"
  | "MFC"
  | "MFL"
  | "MFR"
  | "STC"
  | "STL"
  | "STR";

export class DexieDB extends Dexie {
  leagues!: Table<League>;

  constructor() {
    super("simple-fm-db");
    this.version(2).stores({
      leagues: "++id",
    });
  }
}

export const db = new DexieDB();
