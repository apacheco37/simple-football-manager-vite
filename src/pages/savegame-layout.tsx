import { useLiveQuery } from "dexie-react-hooks";
import { Outlet, useParams } from "react-router-dom";

import { SaveGame, db } from "../db/db";
import { createContext } from "react";

export const SaveGameContext = createContext<{ saveGame: SaveGame }>(
  {} as { saveGame: SaveGame }
);

const SaveGameLayout = () => {
  const { savegameid } = useParams();
  const saveGame = useLiveQuery(() => db.saveGame.get(Number(savegameid)));

  if (!saveGame) return <></>;

  return (
    <SaveGameContext.Provider value={{ saveGame }}>
      <Outlet />
    </SaveGameContext.Provider>
  );
};

export default SaveGameLayout;
