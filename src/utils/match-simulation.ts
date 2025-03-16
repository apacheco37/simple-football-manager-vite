import {
  getSaveGameDB,
  MatchEvent,
  MatchTeamRatings,
  Player,
  TeamLineup,
} from "../db/db";
import { createStandings, generateMatchesForSeasons } from "./data-creation";

export const simulateMatchDay = async (saveGameID: number) => {
  const {
    seasonsDB,
    matchesDB,
    teamLineupsDB,
    playersDB,
    standingsDB,
    teamsDB,
    leaguesDB,
  } = getSaveGameDB(saveGameID);

  const currentSeasonIDs = (await leaguesDB.toArray())
    .map((league) => league.currentSeasonID)
    .filter((item) => item !== undefined);
  const seasons = await seasonsDB.where("id").anyOf(currentSeasonIDs).toArray();

  // this sucks, should be improved ffs
  seasons.forEach(async (season) => {
    const matches = season.lastDayPlayed
      ? await matchesDB
          .where({ seasonID: season.id, day: season.lastDayPlayed + 1 })
          .toArray()
      : await matchesDB.where({ seasonID: season.id, day: 1 }).toArray();

    for (const match of matches) {
      const homeLineup = await teamLineupsDB.get({
        teamID: match.homeTeamID,
      });
      if (!homeLineup) {
        throw new Error("Home lineup not found.");
      }
      const awayLineup = await teamLineupsDB.get({
        teamID: match.awayTeamID,
      });
      if (!awayLineup) {
        throw new Error("Away lineup not found.");
      }

      const homePlayers = await playersDB
        .where({ teamID: match.homeTeamID })
        .toArray();
      const awayPlayers = await playersDB
        .where({ teamID: match.awayTeamID })
        .toArray();

      const eventsHome: MatchEvent[] = [];
      const eventsAway: MatchEvent[] = [];

      const ratings = {
        homeTeam: calculateTeamRatings(homeLineup, homePlayers),
        awayTeam: calculateTeamRatings(awayLineup, awayPlayers),
      };

      for (let i = 0; i < 90; i += 9) {
        // choose team
        const totalRating =
          ratings.homeTeam.midfield + ratings.awayTeam.midfield;
        const possession =
          Math.random() < ratings.homeTeam.midfield / totalRating
            ? "home"
            : "away";

        // check if it is goal
        const [attackingRating, defendingRating] =
          possession === "home"
            ? [ratings.homeTeam.attack, ratings.awayTeam.defense]
            : [ratings.awayTeam.attack, ratings.homeTeam.defense];
        const totalAttackDefenseRating = attackingRating + defendingRating;
        const isGoal =
          Math.random() < attackingRating / totalAttackDefenseRating
            ? true
            : false;

        // add goal
        if (isGoal) {
          const goalEvent: MatchEvent = {
            type: "goal",
            player1ID: (possession === "home" ? homeLineup : awayLineup)
              .strikers[
              Math.floor(
                Math.random() *
                  (possession === "home" ? homeLineup : awayLineup).strikers
                    .length
              )
            ].playerID,
            minute: i + Math.floor(Math.random() * 9),
          };
          (possession === "home" ? eventsHome : eventsAway).push(goalEvent);
        }
      }

      await matchesDB.update(match.id!, {
        ratings,
        events: { homeTeam: eventsHome, awayTeam: eventsAway },
        lineups: {
          homeTeam: homeLineup,
          awayTeam: awayLineup,
        },
      });
      await updateStandings(
        saveGameID,
        season.id!,
        eventsHome.filter((event) => event.type === "goal").length,
        eventsAway.filter((event) => event.type === "goal").length,
        match.homeTeamID,
        match.awayTeamID
      );
      await seasonsDB.update(season.id!, {
        lastDayPlayed: season.lastDayPlayed ? season.lastDayPlayed + 1 : 1,
      });
    }

    if ((season.lastDayPlayed ?? 0 + 1) === season.days) {
      const seasonTeamsIDs = (
        await teamsDB.where({ leagueID: season.leagueID }).toArray()
      ).map((team) => team.id!);

      if (!seasonTeamsIDs.length) {
        throw new Error("No teams found for the season.");
      }

      const newSeasonID = Number(
        await seasonsDB.add({
          leagueID: season.leagueID,
          year: season.year + 1,
          days: season.days,
        })
      );
      const standings = createStandings(newSeasonID, seasonTeamsIDs);
      await standingsDB.add(standings);

      const matches = generateMatchesForSeasons(seasonTeamsIDs, newSeasonID);
      await matchesDB.bulkAdd(matches);

      await leaguesDB.update(season.leagueID, {
        currentSeasonID: newSeasonID,
      });
    }
  });
};

export const calculateTeamRatings = (lineup: TeamLineup, players: Player[]) => {
  const [MAX_DEFENDERS, MAX_MIDFIELDERS, MAX_STRIKERS] = [5, 5, 3];

  const [MAX_DEFENSE_RATING, MAX_MIDFIELD_RATING, MAX_ATTACK_RATING] = [
    100 * MAX_DEFENDERS,
    100 * MAX_MIDFIELDERS,
    100 * MAX_STRIKERS,
  ];

  const ratings: MatchTeamRatings = {
    attack: parseFloat(
      (
        (lineup.strikers.reduce(
          (acc, striker) =>
            acc +
            (players.find((player) => player.id === striker.playerID)?.skill ??
              0),
          0
        ) /
          MAX_ATTACK_RATING) *
        100
      ).toFixed(1)
    ),
    midfield: parseFloat(
      (
        (lineup.midfielders.reduce(
          (acc, midfielder) =>
            acc +
            (players.find((player) => player.id === midfielder.playerID)
              ?.skill ?? 0),
          0
        ) /
          MAX_MIDFIELD_RATING) *
        100
      ).toFixed(1)
    ),
    defense: parseFloat(
      (
        (lineup.defenders.reduce(
          (acc, defender) =>
            acc +
            (players.find((player) => player.id === defender.playerID)?.skill ??
              0),
          0
        ) /
          MAX_DEFENSE_RATING) *
        100
      ).toFixed(1)
    ),
    goalkeeping:
      players.find((player) => player.id === lineup.goalkeeperID)?.skill ?? 0,
  };

  return ratings;
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
