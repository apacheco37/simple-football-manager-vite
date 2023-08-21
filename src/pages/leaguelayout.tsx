import { useLiveQuery } from "dexie-react-hooks";
import { Outlet, useParams } from "react-router-dom";
import { createContext, useState } from "react";
import { Drawer, Toolbar } from "@mui/material";

import { League, db } from "../db/db";

export const LeagueContext = createContext<{ league: League }>(
  {} as { league: League }
);

const LeagueLayout = () => {
  const { leagueid } = useParams();
  const league = useLiveQuery(() => db.leagues.get(Number(leagueid)));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!league) return <></>;

  return (
    <LeagueContext.Provider value={{ league }}>
      <Drawer variant="persistent" open={isSidebarOpen}>
        <Toolbar />
        DraWER!
      </Drawer>
      <Outlet />
    </LeagueContext.Provider>
  );
};

export default LeagueLayout;
