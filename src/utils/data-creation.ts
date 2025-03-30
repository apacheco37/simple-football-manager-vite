import { faker } from "@faker-js/faker";

import {
  ALL_FORMATIONS,
  getSaveGameDB,
  getSaveGamesDB,
  League,
  Match,
  Player,
  Position,
  SaveGame,
  Season,
  Standings,
  Team,
  TeamLineup,
} from "../db/db";
import { teamNames } from "./team-names";
import { getRandomFirstName, getRandomLastName } from "./common-names";
import { CountryCode } from "./countries";

export const createNewGame = async (
  newSaveGameName: string,
  randomizeTeams: boolean = false,
  spectatorMode: boolean = false
) => {
  const saveGamesDB = getSaveGamesDB();
  const saveGameID = (await saveGamesDB.add(
    createSaveGame(newSaveGameName)
  )) as number;

  const saveGameDB = getSaveGameDB(saveGameID);

  const leagueIDs = (await saveGameDB.leaguesDB.bulkAdd(
    createLeagues(4, randomizeTeams),
    {
      allKeys: true,
    }
  )) as number[];

  const teamsPerLeague = 16;

  await saveGameDB.teamsDB.bulkAdd(
    createTeams(leagueIDs, teamsPerLeague, randomizeTeams)
  );
  const teams = await saveGameDB.teamsDB.toArray();

  if (!spectatorMode) {
    await saveGamesDB.update(saveGameID, { humanTeamID: teams[0].id });
  }

  const playerPositions: Position[] = [
    "GK",
    "GK",
    "DF-L",
    "DF-L",
    "DF-C",
    "DF-C",
    "DF-C",
    "DF-C",
    "DF-R",
    "DF-R",
    "MF-L",
    "MF-C",
    "MF-C",
    "MF-C",
    "MF-R",
    "ST-L",
    "ST-C",
    "ST-C",
    "ST-C",
    "ST-R",
  ];

  const playerIDs = await saveGameDB.playersDB.bulkAdd(
    createPlayers(
      playerPositions,
      teams.map(({ id, countryCode }) => ({ id: id!, countryCode }))
    ),
    { allKeys: true }
  );
  const players = await saveGameDB.playersDB.bulkGet(playerIDs);
  await saveGameDB.teamLineupsDB.bulkAdd(
    createLineups(
      teams.map((team) => team.id!),
      players.filter((player) => player !== undefined)
    )
  );

  const seasonIDs = (await saveGameDB.seasonsDB.bulkAdd(
    createSeasons(leagueIDs, teamsPerLeague),
    { allKeys: true }
  )) as number[];

  for (const seasonID of seasonIDs) {
    const leagueID = (await saveGameDB.seasonsDB.get(seasonID))?.leagueID;
    await saveGameDB.leaguesDB.update(leagueID!, { currentSeasonID: seasonID });

    const seasonTeamsIDs = (
      await saveGameDB.teamsDB.where({ leagueID }).toArray()
    ).map((team) => team.id!);
    if (!seasonTeamsIDs.length) {
      throw new Error("No teams found for the season.");
    }

    const standings = createStandings(seasonID, seasonTeamsIDs);
    await saveGameDB.standingsDB.add(standings);

    const matches = generateMatchesForSeasons(seasonTeamsIDs, seasonID);
    await saveGameDB.matchesDB.bulkAdd(matches);
  }

  return saveGameID;
};

const createSaveGame = (saveGameName: string) => {
  const saveGame: SaveGame = {
    name: saveGameName,
    creationDate: new Date(),
  };

  return saveGame;
};

const createLeagues = (leaguesQuantity: number, randomizeTeams: boolean) => {
  const leagues: League[] = [];

  if (randomizeTeams) {
    for (let i = 0; i < leaguesQuantity; i++) {
      leagues.push({
        name: `League ${i}`,
      });
    }
  } else {
    leagues.push({
      id: 0,
      name: "Americas",
    });
    leagues.push({
      id: 1,
      name: "Europe",
    });
    leagues.push({
      id: 2,
      name: "Asia",
    });
    leagues.push({
      id: 3,
      name: "Africa",
    });
  }

  return leagues;
};

const createTeams = (
  leagueIDs: number[],
  teamsQuantity: number,
  randomizeTeams: boolean
) => {
  const teams: Team[] = [];

  if (randomizeTeams) {
    leagueIDs.forEach((leagueID) => {
      for (let i = 0; i < teamsQuantity; i++) {
        teams.push({
          name: generateRandomTeamName(),
          leagueID,
          countryCode: faker.location.countryCode() as CountryCode, // TODO: check if it makes sense
        });
      }
    });
  } else {
    teams.push(
      ...teamNames.americas.map(({ name, countryCode }) => ({
        name,
        leagueID: 0,
        countryCode,
      }))
    );
    teams.push(
      ...teamNames.europe.map(({ name, countryCode }) => ({
        name,
        leagueID: 1,
        countryCode,
      }))
    );
    teams.push(
      ...teamNames.asia.map(({ name, countryCode }) => ({
        name,
        leagueID: 2,
        countryCode,
      }))
    );
    teams.push(
      ...teamNames.africa.map(({ name, countryCode }) => ({
        name,
        leagueID: 3,
        countryCode,
      }))
    );
  }

  return teams;
};

const createPlayers = (
  positions: Position[],
  teams: { id: number; countryCode: CountryCode }[]
) => {
  const players: Player[] = [];

  teams.forEach(({ id, countryCode }) => {
    players.push(...generateRandomPlayers(positions, id, countryCode));
  });

  return players;
};

const createLineups = (teamIDs: number[], players: Player[]) => {
  const lineups: TeamLineup[] = [];

  teamIDs.forEach((teamID) => {
    const teamPlayers = players.filter((player) => player.teamID === teamID);

    const { defenders, midfielders, strikers } =
      ALL_FORMATIONS[Math.floor(Math.random() * (ALL_FORMATIONS.length - 1))];

    const lineup: TeamLineup = {
      teamID,
      goalkeeperID: teamPlayers[0].id!,
      defenders: defenders.map((position, index) => ({
        position,
        playerID: teamPlayers[index + 1].id!,
      })),
      midfielders: midfielders.map((position, index) => ({
        position,
        playerID: teamPlayers[index + 1 + defenders.length].id!,
      })),
      strikers: strikers.map((position, index) => ({
        position,
        playerID:
          teamPlayers[index + 1 + defenders.length + midfielders.length].id!,
      })),
    };

    lineups.push(lineup);
  });

  return lineups;
};

const createSeasons = (leagueIDs: number[], teamsPerLeague: number) => {
  const seasons: Season[] = [];
  const matchDaysPerSeason = (teamsPerLeague - 1) * 2;

  leagueIDs.forEach((leagueID) => {
    seasons.push({
      year: 1,
      leagueID,
      days: matchDaysPerSeason,
    });
  });

  return seasons;
};

export const createStandings = (seasonID: number, teamIDs: number[]) => {
  const standings: Standings = {
    seasonID,
    teams: {},
  };

  teamIDs.forEach((teamID) => {
    standings.teams[teamID] = {
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };
  });

  return standings;
};

export const generateMatchesForSeasons = (
  teamIDs: number[],
  seasonID: number
) => {
  const teamsQuantity = teamIDs.length;

  if (teamsQuantity % 2 !== 0) {
    throw new Error(
      "The number of teams must be even to generate a valid fixture."
    );
  }

  const matches: Match[] = [];
  const matchDaysQuantity = teamsQuantity - 1;
  const matchesPerDay = teamsQuantity / 2;

  for (let i = 0; i < matchDaysQuantity; i++) {
    const matchesFirstRound: Match[] = [];
    const matchesSecondRound: Match[] = [];

    const firstSlice = teamIDs.slice(i); // Get the elements from index X to the end
    const secondSlice = teamIDs.slice(0, i); // Get the first X elements
    const rotatedTeamIDs = firstSlice.concat(secondSlice); // Concatenate the slices

    for (let j = 0; j < matchesPerDay; j++) {
      const homeTeamID = rotatedTeamIDs[j];
      const awayTeamID = rotatedTeamIDs[rotatedTeamIDs.length - 1 - j];
      matchesFirstRound.push({
        homeTeamID,
        awayTeamID,
        seasonID,
        day: i + 1,
      });
      matchesSecondRound.push({
        homeTeamID,
        awayTeamID,
        seasonID,
        day: i + 1 + matchDaysQuantity,
      });
    }
    matches.push(...matchesFirstRound, ...matchesSecondRound);
  }

  return matches;
};

const generateRandomPlayers = (
  positions: Position[],
  teamID: number,
  teamCountryCode: CountryCode
) => {
  const players: Player[] = [];

  for (let i = 0; i < positions.length; i++) {
    players.push({
      firstName: getRandomFirstName(teamCountryCode),
      lastName: getRandomLastName(teamCountryCode),
      age: randomNormal(18, 36, 25, 5),
      skill: randomNormal(),
      position: positions[i],
      teamID,
      nationalityCode: teamCountryCode,
    });
  }

  return players;
};

const generateRandomTeamName = () => {
  return `${faker.location.city()} ${faker.animal.dog()}s`;
};

const randomNormal = (min = 0, max = 100, mean = 50, stdDev = 13) => {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  const result = Math.round(mean + stdDev * z);

  return Math.min(max, Math.max(min, result)); // Clamp to [min, max]
};
