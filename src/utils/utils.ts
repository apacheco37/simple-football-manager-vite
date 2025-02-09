import { faker } from "@faker-js/faker";

import {
  ALL_POSITIONS,
  getSaveGameDB,
  getSaveGamesDB,
  League,
  Match,
  Player,
  SaveGame,
  Season,
  Standings,
  Team,
} from "../db/db";
import { teamNames } from "./team-names";

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

  const teamIDs = (await saveGameDB.teamsDB.bulkAdd(
    createTeams(leagueIDs, teamsPerLeague, randomizeTeams),
    {
      allKeys: true,
    }
  )) as number[];

  if (!spectatorMode) {
    await saveGamesDB.update(saveGameID, { humanTeamID: teamIDs[0] });
  }

  await saveGameDB.playersDB.bulkAdd(createPlayers(20, teamIDs));

  const seasonIDs = (await saveGameDB.seasonsDB.bulkAdd(
    createSeasons(leagueIDs, teamsPerLeague),
    { allKeys: true }
  )) as number[];

  for (const seasonID of seasonIDs) {
    const leagueID = (await saveGameDB.seasonsDB.get(seasonID))?.leagueID;
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
        });
      }
    });
  } else {
    teams.push(...teamNames.americas.map((name) => ({ name, leagueID: 0 })));
    teams.push(...teamNames.europe.map((name) => ({ name, leagueID: 1 })));
    teams.push(...teamNames.asia.map((name) => ({ name, leagueID: 2 })));
    teams.push(...teamNames.africa.map((name) => ({ name, leagueID: 3 })));
  }

  return teams;
};

const createPlayers = (playersQuantity: number, teamIDs: number[]) => {
  const players: Player[] = [];

  teamIDs.forEach((teamID) => {
    players.push(...generateRandomPlayers(playersQuantity, teamID));
  });

  return players;
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

const createStandings = (seasonID: number, teamIDs: number[]) => {
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

const generateMatchesForSeasons = (teamIDs: number[], seasonID: number) => {
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

const generateRandomPlayers = (quantity: number, teamID: number) => {
  const players: Player[] = [];

  for (let i = 0; i < quantity; i++) {
    players.push({
      firstName: faker.person.firstName("male"),
      lastName: faker.person.lastName("male"),
      age: faker.number.int({ min: 18, max: 36 }),
      skill: faker.number.int({ min: 0, max: 100 }),
      position: ALL_POSITIONS[faker.number.int(ALL_POSITIONS.length - 1)],
      teamID,
    });
  }

  return players;
};

const generateRandomTeamName = () => {
  return `${faker.location.city()} ${faker.animal.dog()}s`;
};

export const simulateMatchDay = async (saveGameID: number) => {
  const { seasonsDB, matchesDB } = getSaveGameDB(saveGameID);

  // this sucks, should be improved ffs
  (await seasonsDB.toArray()).forEach(async (season) => {
    const matches = season.lastDayPlayed
      ? await matchesDB
          .where({ seasonID: season.id, day: season.lastDayPlayed + 1 })
          .toArray()
      : await matchesDB.where({ seasonID: season.id, day: 1 }).toArray();

    for (const match of matches) {
      const homeScore = faker.number.int({ min: 0, max: 5 });
      const awayScore = faker.number.int({ min: 0, max: 5 });

      const eventsHome = [];
      const eventsAway = [];

      for (let i = 0; i < homeScore; i++) {
        const playerID = 1; // TODO
        const minute = faker.number.int({ min: 1, max: 90 });
        const event = {
          type: "goal",
          teamID: match.homeTeamID,
          playerID,
          minute,
        };
        eventsHome.push(event);
      }

      for (let i = 0; i < awayScore; i++) {
        const playerID = 1; // TODO
        const minute = faker.number.int({ min: 1, max: 90 });
        const event = {
          type: "goal",
          teamID: match.awayTeamID,
          playerID,
          minute,
        };
        eventsAway.push(event);
      }

      await matchesDB.update(match.id!, {
        // ratings: {
        //   homeTeam: generateRandomTeamRatings(),
        //   awayTeam: generateRandomTeamRatings(),
        // },
        events: { homeTeam: eventsHome, awayTeam: eventsAway },
      });
      await updateStandings(
        saveGameID,
        season.id!,
        homeScore,
        awayScore,
        match.homeTeamID,
        match.awayTeamID
      );
      await seasonsDB.update(season.id!, {
        lastDayPlayed: season.lastDayPlayed ? season.lastDayPlayed + 1 : 1,
      });
    }
  });
};

const updateStandings = async (
  saveGameID: number,
  seasonID: number,
  homeGoals: number,
  awayGoals: number,
  homeTeamID: number,
  awayTeamID: number
) => {
  const { standingsDB } = getSaveGameDB(saveGameID);
  const standings = await standingsDB.get({ seasonID: seasonID });

  if (!standings) {
    throw new Error("Standings not found.");
  }

  if (homeGoals > awayGoals) {
    standings.teams[homeTeamID].points += 3;
    standings.teams[homeTeamID].wins += 1;
    standings.teams[awayTeamID].losses += 1;
  } else if (homeGoals < awayGoals) {
    standings.teams[awayTeamID].points += 3;
    standings.teams[awayTeamID].wins += 1;
    standings.teams[homeTeamID].losses += 1;
  } else {
    standings.teams[homeTeamID].points += 1;
    standings.teams[awayTeamID].points += 1;
    standings.teams[homeTeamID].draws += 1;
    standings.teams[awayTeamID].draws += 1;
  }

  standings.teams[homeTeamID].goalsFor += homeGoals;
  standings.teams[homeTeamID].goalsAgainst += awayGoals;
  standings.teams[awayTeamID].goalsFor += awayGoals;
  standings.teams[awayTeamID].goalsAgainst += homeGoals;

  await standingsDB.put(standings, standings.id);
};
