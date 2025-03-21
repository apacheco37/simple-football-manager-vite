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
  countryCode: string;
}

export interface Player {
  id?: number;
  firstName: string;
  lastName: string;
  age: number;
  skill: number;
  position: Position;
  teamID: number | null;
  nationalityCode: string;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow_card" | "red_card" | "injury" | "substitution";
  player1ID: number;
  player2ID?: number;
}

export interface MatchTeamRatings {
  attack: number;
  midfield: number;
  defense: number;
  goalkeeping: number;
}

// export interface MatchTeamPlayer {
//   playerID: number;
//   position: Position;
//   skill: number;
// }

export interface Match {
  id?: number;
  homeTeamID: number;
  awayTeamID: number;
  day: number;
  seasonID: number;
  neutral?: true;
  lineups?: { homeTeam: TeamLineup; awayTeam: TeamLineup };
  ratings?: { homeTeam: MatchTeamRatings; awayTeam: MatchTeamRatings };
  events?: { homeTeam: MatchEvent[]; awayTeam: MatchEvent[] };
}

export interface TeamLineup {
  teamID: number;
  goalkeeperID: number;
  defenders: { position: Position; playerID: number }[];
  midfielders: { position: Position; playerID: number }[];
  strikers: { position: Position; playerID: number }[];
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
  currentSeasonID?: number;
}

export const ALL_POSITIONS = [
  "GK",
  "DF-C",
  "DF-L",
  "DF-R",
  "MF-C",
  "MF-L",
  "MF-R",
  "ST-C",
  "ST-L",
  "ST-R",
] as const;
export type Position = (typeof ALL_POSITIONS)[number];

export const ALL_FORMATIONS: Formation[] = [
  {
    name: "3-5-2",
    defenders: ["DF-C", "DF-C", "DF-C"],
    midfielders: ["MF-L", "MF-C", "MF-C", "MF-C", "MF-R"],
    strikers: ["ST-C", "ST-C"],
  },
  {
    name: "3-4-3",
    defenders: ["DF-C", "DF-C", "DF-C"],
    midfielders: ["MF-L", "MF-C", "MF-C", "MF-R"],
    strikers: ["ST-L", "ST-C", "ST-R"],
  },
  {
    name: "4-5-1",
    defenders: ["DF-L", "DF-C", "DF-C", "DF-R"],
    midfielders: ["MF-L", "MF-C", "MF-C", "MF-C", "MF-R"],
    strikers: ["ST-C"],
  },
  {
    name: "4-4-2",
    defenders: ["DF-L", "DF-C", "DF-C", "DF-R"],
    midfielders: ["MF-L", "MF-C", "MF-C", "MF-R"],
    strikers: ["ST-C", "ST-C"],
  },
  {
    name: "4-3-3",
    defenders: ["DF-L", "DF-C", "DF-C", "DF-R"],
    midfielders: ["MF-C", "MF-C", "MF-C"],
    strikers: ["ST-L", "ST-C", "ST-R"],
  },
  {
    name: "5-4-1",
    defenders: ["DF-L", "DF-C", "DF-C", "DF-C", "DF-R"],
    midfielders: ["MF-L", "MF-C", "MF-C", "MF-R"],
    strikers: ["ST-C"],
  },
  {
    name: "5-3-2",
    defenders: ["DF-L", "DF-C", "DF-C", "DF-C", "DF-R"],
    midfielders: ["MF-C", "MF-C", "MF-C"],
    strikers: ["ST-C", "ST-C"],
  },
];

export type Formation = {
  name: string;
  defenders: Position[];
  midfielders: Position[];
  strikers: Position[];
};

export class SaveGameDB extends Dexie {
  teamsDB!: Table<Team>;
  playersDB!: Table<Player>;
  leaguesDB!: Table<League>;
  seasonsDB!: Table<Season>;
  matchesDB!: Table<Match>;
  standingsDB!: Table<Standings>;
  teamLineupsDB!: Table<TeamLineup>;

  constructor(saveGameID: number) {
    super(`savegame-${saveGameID}`);
    this.version(2).stores({
      teamsDB: "++id, leagueID",
      playersDB: "++id, teamID",
      leaguesDB: "++id",
      seasonsDB: "++id, leagueID",
      matchesDB: "++id, homeTeamID, awayTeamID, day, seasonID",
      standingsDB: "++id, &seasonID",
      teamLineupsDB: "teamID",
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
