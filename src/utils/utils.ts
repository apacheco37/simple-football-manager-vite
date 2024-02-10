import { faker } from "@faker-js/faker";
import {
  ALL_POSITIONS,
  League,
  Match,
  MatchDay,
  Player,
  SaveGame,
  Season,
  Team,
} from "../db/db";

export const createNewGame = (
  name: string,
  leaguesQuantity: number,
  teamsQuantity: number,
  playersPerTeam: number
) => {
  const leagues: League[] = [];
  let players: Player[] = [];
  let teams: Team[] = [];

  for (let i = 0; i < leaguesQuantity; i++) {
    const newLeague = createNewLeague(i, teamsQuantity, playersPerTeam);
    leagues.push(newLeague.league);
    players = players.concat(newLeague.players);
    teams = teams.concat(newLeague.teams);
  }

  const newGame: SaveGame = {
    name,
    leagues,
    teams,
    players,
  };

  return newGame;
};

const createNewLeague = (
  leagueID: number,
  teamsQuantity: number,
  playersPerTeam: number
) => {
  const teams = generateRandomTeams(leagueID, teamsQuantity);
  let players: Player[] = [];
  let playerID = 0;

  teams.forEach((team) => {
    players = players.concat(
      generateRandomPlayers(playersPerTeam, playerID, team.id)
    );
    playerID = playerID + playersPerTeam;
  });

  const league: League = {
    id: leagueID,
    name: `League ${leagueID}`,
    seasons: [generateSeason(teams.map((team) => team.id))],
  };

  return { league, teams, players };
};

const generateFixture = (teamIDs: number[]) => {
  const teamsQuantity = teamIDs.length;

  if (teamsQuantity % 2 !== 0) {
    throw new Error(
      "The number of teams must be even to generate a valid fixture."
    );
  }

  const fixture: MatchDay[] = [];
  const matchDays = teamsQuantity - 1;
  const matchesPerDay = teamsQuantity / 2;

  for (let i = 0; i < matchDays; i++) {
    const matchesFirstRound: Match[] = [];
    const matchesSecondRound: Match[] = [];

    // const firstSlice = teamIDs.slice(i); // Get the elements from index X to the end
    // const secondSlice = teamIDs.slice(0, i); // Get the first X elements
    // const rotatedTeamIDs = firstSlice.concat(secondSlice); // Concatenate the slices

    for (let j = 0; j < matchesPerDay; j++) {
      // const homeTeamID = rotatedTeamIDs[j];
      // const awayTeamID = rotatedTeamIDs[rotatedTeamIDs.length - 1 - j];
      matchesFirstRound.push();
      matchesSecondRound.push();
    }

    const matchDayFirstRound: MatchDay = {
      day: i + 1,
      matches: matchesFirstRound,
    };
    const matchDaySecondRound: MatchDay = {
      day: i + 1 + matchDays,
      matches: matchesSecondRound,
    };

    fixture.push(...[matchDayFirstRound, matchDaySecondRound]);
  }

  return fixture;
};

const generateSeason = (teamIDs: number[]) => {
  const season: Season = { fixture: generateFixture(teamIDs) };

  return season;
};

const generateRandomPlayers = (
  quantity: number,
  baseID: number,
  teamID: number
) => {
  const players: Player[] = [];

  for (let i = 0; i < quantity; i++) {
    players.push({
      id: baseID + i,
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

const generateRandomTeams = (leagueID: number, quantity: number) => {
  const teams: Team[] = [];

  for (let i = 0 + leagueID * quantity; i < (1 + leagueID) * quantity; i++) {
    teams.push({
      id: i,
      name: generateRandomTeamName(),
      leagueID,
    });
  }

  return teams;
};
