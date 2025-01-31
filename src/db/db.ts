import Dexie, { Table } from "dexie";

export interface SaveGame {
  id?: number;
  name: string;
}

export interface Team {
  id?: number;
  name: string;
  leagueID: number;
}

export interface Player {
  id?: number;
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
  id?: number;
  homeTeamID: number;
  awayTeamID: number;
  matchDayID: string;
  neutral?: true;
  lineups?: { homeTeam: MatchTeamPlayer[]; awayTeam: MatchTeamPlayer[] };
  ratings?: { homeTeam: MatchTeamRatings; awayTeam: MatchTeamRatings };
  events?: { homeTeam: MatchEvent[]; awayTeam: MatchEvent[] };
}

export interface MatchDay {
  id?: string;
  day: number;
  seasonID: number;
}

export interface Season {
  id?: number;
  year: number;
  leagueID: number;
}

export interface League {
  id?: number;
  name: string;
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

export class SaveGameDB extends Dexie {
  teams!: Table<Team>;
  players!: Table<Player>;
  leagues!: Table<League>;
  seasons!: Table<Season>;
  matches!: Table<Match>;
  matchDays!: Table<MatchDay>;

  constructor(saveGameID: number) {
    super(`savegame-${saveGameID}`);
    this.version(1).stores({
      teams: "++id, leagueID",
      players: "++id, teamID",
      leagues: "++id",
      seasons: "++id, leagueID",
      matches: "++id, homeTeamID, awayTeamID, matchDayID",
      matchDays: "++id, seasonID",
    });
  }
}

class SaveGamesDB extends Dexie {
  saveGames!: Table<SaveGame>;

  constructor() {
    super("save-games");
    this.version(1).stores({
      saveGames: "++id",
    });
  }
}

export const getSaveGameDB = (saveGameID: number) => new SaveGameDB(saveGameID);
export const getSaveGamesDB = () => new SaveGamesDB();
