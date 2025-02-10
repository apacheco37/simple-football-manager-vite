import Dexie, { Table } from "dexie";

export interface SaveGame {
  id?: number;
  name: string;
  creationDate: Date;
  humanTeamID?: number;
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
  day: number;
  seasonID: number;
  neutral?: true;
  lineups?: { homeTeam: MatchTeamPlayer[]; awayTeam: MatchTeamPlayer[] };
  ratings?: { homeTeam: MatchTeamRatings; awayTeam: MatchTeamRatings };
  events?: { homeTeam: MatchEvent[]; awayTeam: MatchEvent[] };
}

export interface Season {
  id?: number;
  year: number;
  leagueID: number;
  days: number;
  lastDayPlayed?: number;
}

export interface Standings {
  id?: number;
  seasonID: number;
  teams: {
    [teamID: number]: {
      points: number;
      wins: number;
      draws: number;
      losses: number;
      goalsFor: number;
      goalsAgainst: number;
    };
  };
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
  teamsDB!: Table<Team>;
  playersDB!: Table<Player>;
  leaguesDB!: Table<League>;
  seasonsDB!: Table<Season>;
  matchesDB!: Table<Match>;
  standingsDB!: Table<Standings>;

  constructor(saveGameID: number) {
    super(`savegame-${saveGameID}`);
    this.version(2).stores({
      teamsDB: "++id, leagueID",
      playersDB: "++id, teamID",
      leaguesDB: "++id",
      seasonsDB: "++id, leagueID",
      matchesDB: "++id, homeTeamID, awayTeamID, day, seasonID",
      standingsDB: "++id, &seasonID",
    });
  }
}

class SaveGamesDB extends Dexie {
  saveGamesDB!: Table<SaveGame>;

  constructor() {
    super("save-games");
    this.version(2).stores({
      saveGamesDB: "++id",
    });
  }
}

export const getSaveGameDB = (saveGameID: number) => new SaveGameDB(saveGameID);
export const getSaveGamesDB = () => new SaveGamesDB().saveGamesDB;
