import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

import {
  ALL_POSITIONS,
  getSaveGameDB,
  getSaveGamesDB,
  League,
  Match,
  MatchDay,
  Player,
  SaveGame,
  Season,
  Team,
} from "../db/db";

export const createNewGame = async (newSaveGameName: string) => {
  const saveGamesDB = getSaveGamesDB();
  const saveGameID = (await saveGamesDB.saveGames.add(
    createSaveGame(newSaveGameName)
  )) as number;

  const saveGameDB = getSaveGameDB(saveGameID);

  const leagueIDs = (await saveGameDB.leagues.bulkAdd(createLeagues(4), {
    allKeys: true,
  })) as number[];

  const teamIDs = (await saveGameDB.teams.bulkAdd(createTeams(leagueIDs, 16), {
    allKeys: true,
  })) as number[];

  await saveGameDB.players.bulkAdd(createPlayers(20, teamIDs));

  const seasonIDs = (await saveGameDB.seasons.bulkAdd(
    createSeasons(leagueIDs),
    { allKeys: true }
  )) as number[];

  for (const seasonID of seasonIDs) {
    const leagueID = (await saveGameDB.seasons.get(seasonID))?.leagueID;
    const seasonTeams = await saveGameDB.teams.where({ leagueID }).toArray();
    if (!seasonTeams.length) {
      throw new Error("No teams found for the season.");
    }
    const { matches, matchDays } = generateMatchDaysForSeasons(
      seasonTeams.map((team) => team.id!),
      seasonID
    );
    await saveGameDB.matches.bulkAdd(matches);
    await saveGameDB.matchDays.bulkAdd(matchDays);
  }

  return saveGameID;
};

const createSaveGame = (saveGameName: string) => {
  const saveGame: SaveGame = {
    name: saveGameName,
  };

  return saveGame;
};

const createLeagues = (leaguesQuantity: number) => {
  const leagues: League[] = [];

  for (let i = 0; i < leaguesQuantity; i++) {
    leagues.push({
      name: `League ${i}`,
    });
  }

  return leagues;
};

const createTeams = (leagueIDs: number[], teamsQuantity: number) => {
  const teams: Team[] = [];

  leagueIDs.forEach((leagueID) => {
    for (let i = 0; i < teamsQuantity; i++) {
      teams.push({
        name: generateRandomTeamName(),
        leagueID,
      });
    }
  });

  return teams;
};

const createPlayers = (playersQuantity: number, teamIDs: number[]) => {
  const players: Player[] = [];

  teamIDs.forEach((teamID) => {
    players.push(...generateRandomPlayers(playersQuantity, teamID));
  });

  return players;
};

const createSeasons = (leagueIDs: number[]) => {
  const seasons: Season[] = [];

  leagueIDs.forEach((leagueID) => {
    seasons.push({
      year: 1,
      leagueID,
    });
  });

  return seasons;
};

const generateMatchDaysForSeasons = (teamIDs: number[], seasonID: number) => {
  const teamsQuantity = teamIDs.length;

  if (teamsQuantity % 2 !== 0) {
    throw new Error(
      "The number of teams must be even to generate a valid fixture."
    );
  }

  const matchDays: MatchDay[] = [];
  const matches: Match[] = [];
  const matchDaysQuantity = teamsQuantity - 1;
  const matchesPerDay = teamsQuantity / 2;

  for (let i = 0; i < matchDaysQuantity; i++) {
    const matchesFirstRound: Match[] = [];
    const matchesSecondRound: Match[] = [];

    const firstSlice = teamIDs.slice(i); // Get the elements from index X to the end
    const secondSlice = teamIDs.slice(0, i); // Get the first X elements
    const rotatedTeamIDs = firstSlice.concat(secondSlice); // Concatenate the slices

    const matchDayFirstRoundID = uuidv4();
    const matchDaySecondRoundID = uuidv4();

    for (let j = 0; j < matchesPerDay; j++) {
      const homeTeamID = rotatedTeamIDs[j];
      const awayTeamID = rotatedTeamIDs[rotatedTeamIDs.length - 1 - j];
      matchesFirstRound.push({
        homeTeamID,
        awayTeamID,
        matchDayID: matchDayFirstRoundID,
      });
      matchesSecondRound.push({
        homeTeamID,
        awayTeamID,
        matchDayID: matchDaySecondRoundID,
      });
    }

    const matchDayFirstRound: MatchDay = {
      id: matchDayFirstRoundID,
      day: i + 1,
      seasonID,
    };
    const matchDaySecondRound: MatchDay = {
      id: matchDaySecondRoundID,
      day: i + 1 + matchDaysQuantity,
      seasonID,
    };

    matchDays.push(...[matchDayFirstRound, matchDaySecondRound]);
    matches.push(...matchesFirstRound, ...matchesSecondRound);
  }

  return { matchDays, matches };
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

// const simulateMatchDay = async (matchDay: MatchDay) => {
//   const results = matchDay.matches.map((match) => {
//     const homeScore = faker.number.int({ min: 0, max: 5 });
//     const awayScore = faker.number.int({ min: 0, max: 5 });

//     return {
//       matchID: match.id,
//       homeScore,
//       awayScore,
//     };
//   });

//   await db.saveGame.put(
//     ...saveGame,
//     ...{saveGame.leagues[leagueID].seasons[seasonID].fixture[matchDay.day - 1].matches}
//   );

//   return results;
// };
