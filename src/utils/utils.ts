import { League, Player, Team } from "../db/db";

export const createNewLeague = (name: string) => {
  const league: League = { name, teams: generateRandomTeams(4) };

  return league;
};

const generateRandomPlayers = (quantity: number) => {
  const players: Player[] = [];

  for (let i = 0; i < quantity; i++) {
    players.push({
      firstName: `FirstName${i}`,
      lastName: `LastName${i}`,
      age: 3,
      skill: 4,
      position: "GK",
    });
  }

  return players;
};

const generateRandomTeams = (quantity: number) => {
  const teams: Team[] = [];

  for (let i = 0; i < quantity; i++) {
    teams.push({ name: `Jorge${i}`, players: generateRandomPlayers(5) });
  }

  return teams;
};
