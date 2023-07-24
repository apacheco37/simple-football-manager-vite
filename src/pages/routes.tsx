import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./layout";
import Leagues from "./leagues";
import Teams from "./teams";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={"/leagues"} />} />
        <Route path="leagues" element={<Leagues />} />
        <Route path="leagues/:leagueid/teams" element={<Teams />} />
        <Route
          path="leagues/:leagueid/teams/:teamid/players"
          // element={<Players />}
        />
        <Route
          path="leagues/:leagueid/players/:playerid"
          // element={<PlayerDetails />}
        />

        {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
        {/* <Route path="*" element={<NoMatch />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
