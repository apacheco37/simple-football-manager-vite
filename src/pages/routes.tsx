import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout";
import Teams from "./teams";
import Players from "./players";
import SaveGameLayout from "./savegame-layout";
import SaveGames from "./savegames";
import PlayerDetails from "./player-details";
import Leagues from "./leagues";
import LeagueDetails from "./league-details";
import Schedule from "./schedule";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={"/save-games"} />} />
        <Route path="save-games" element={<SaveGames />} />
        <Route path="save-games/:savegameid" element={<SaveGameLayout />}>
          <Route path="teams" element={<Teams />} />
          <Route path="teams/:teamid/players" element={<Players />} />
          <Route path="players/:playerid" element={<PlayerDetails />} />
          <Route path="leagues" element={<Leagues />} />
          <Route path="leagues/:leagueid" element={<LeagueDetails />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>

        {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
        {/* <Route path="*" element={<NoMatch />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
