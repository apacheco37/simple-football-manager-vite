import { useLiveQuery } from "dexie-react-hooks";
import { Outlet, useParams } from "react-router-dom";

import { League, db } from "../db/db";
import { createContext } from "react";

export const LeagueContext = createContext<{ league: League }>(
  {} as { league: League }
);

const LeagueLayout = () => {
  const { leagueid } = useParams();
  const league = useLiveQuery(() => db.leagues.get(Number(leagueid)));

  if (!league) return <></>;

  return (
    <LeagueContext.Provider value={{ league }}>
      <Outlet />
    </LeagueContext.Provider>
  );
};

export default LeagueLayout;
