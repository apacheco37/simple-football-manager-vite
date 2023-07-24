import { faker } from "@faker-js/faker";
import { ALL_POSITIONS, League, Player, Team } from "../db/db";

export const createNewLeague = (
  name: string,
  teamsQuantity: number,
  playersPerTeam: number
) => {
  const teams = generateRandomTeams(teamsQuantity);
  let players: Player[] = [];
  let playerID = 0;

  teams.forEach((team) => {
    players = players.concat(
      generateRandomPlayers(playersPerTeam, playerID, team.id)
    );
    playerID = playerID + playersPerTeam;
  });

  const league: League = { name, teams, players };

  return league;
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

const generateRandomTeams = (quantity: number) => {
  const teams: Team[] = [];

  for (let i = 0; i < quantity; i++) {
    teams.push({
      id: i,
      name: generateRandomTeamName(),
    });
  }

  return teams;
};
