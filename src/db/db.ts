import Dexie, { Table } from "dexie";

export interface SaveGame {
  id?: number;
  name: string;
  leagues: League[];
  teams: Team[];
  players: Player[];
}

export interface Team {
  id: number;
  name: string;
  leagueID: number;
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

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow_card" | "red_card" | "injury" | "substitution";
  player1ID: number;
  player2ID: number | null;
}

export interface MatchTeamRatings {
  attack: number;
  midfield: number;
  defense: number;
  goalkeeping: number;
}

export interface MatchTeamPlayer {
  playerID: number;
  position: Position;
  skill: number;
}

export interface Match {
  id: number;
  homeTeamID: number;
  awayTeamID: number;
  neutral: boolean;
  lineups?: { homeTeam: MatchTeamPlayer[]; awayTeam: MatchTeamPlayer[] };
  ratings?: { homeTeam: MatchTeamRatings; awayTeam: MatchTeamRatings };
  events?: { homeTeam: MatchEvent[]; awayTeam: MatchEvent[] };
}

export interface MatchDay {
  day: number;
  matches: Match[];
}

export interface Season {
  fixture: MatchDay[];
}

export interface League {
  id: number;
  name: string;
  seasons: Season[];
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
  saveGame!: Table<SaveGame>;

  constructor() {
    super("simple-fm-db");
    this.version(4).stores({
      saveGame: "++id",
    });
  }
}

export const db = new DexieDB();
