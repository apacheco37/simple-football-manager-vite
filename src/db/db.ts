import Dexie, { Table } from "dexie";

export interface League {
  id?: number;
  name: string;
}

export class DexieDB extends Dexie {
  leagues!: Table<League>;

  constructor() {
    super("simple-fm-db");
    this.version(1).stores({
      leagues: "++id",
    });
  }
}

export const db = new DexieDB();
