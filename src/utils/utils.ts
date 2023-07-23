import { faker } from "@faker-js/faker";
import { ALL_POSITIONS, League, Player, Team } from "../db/db";

export const createNewLeague = (name: string) => {
  const league: League = { name, teams: generateRandomTeams(16) };

  return league;
};

const generateRandomPlayers = (quantity: number) => {
  const players: Player[] = [];

  for (let i = 0; i < quantity; i++) {
    players.push({
      firstName: faker.person.firstName("male"),
      lastName: faker.person.lastName("male"),
      age: faker.number.int({ min: 18, max: 36 }),
      skill: faker.number.int({ min: 0, max: 100 }),
      position: ALL_POSITIONS[faker.number.int(ALL_POSITIONS.length - 1)],
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
      name: generateRandomTeamName(),
      players: generateRandomPlayers(20),
    });
  }

  return teams;
};
