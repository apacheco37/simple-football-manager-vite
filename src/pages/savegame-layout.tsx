import { useLiveQuery } from "dexie-react-hooks";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { SaveGame, SaveGameDB, getSaveGameDB, getSaveGamesDB } from "../db/db";
import { createContext } from "react";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { simulateMatchDay } from "../utils/match-simulation";

export const SaveGameContext = createContext<{
  saveGame: SaveGame;
  saveGameDB: SaveGameDB;
}>({} as { saveGame: SaveGame; saveGameDB: SaveGameDB });

const drawerWidth = 180;

const SaveGameLayout = () => {
  const { savegameid } = useParams();
  const saveGame = useLiveQuery(() => getSaveGamesDB().get(Number(savegameid)));
  const navigate = useNavigate();
  const location = useLocation();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handlePlayClick = () => {
    simulateMatchDay(Number(savegameid));
  };

  if (!saveGame) return <></>;

  return (
    <SaveGameContext.Provider
      value={{ saveGame, saveGameDB: getSaveGameDB(Number(savegameid)) }}
    >
      <Drawer
        variant="persistent"
        open={true}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem key={"My Players"} disablePadding>
            <ListItemButton
              onClick={() => navigate(`teams/${saveGame.humanTeamID}/players`)}
              selected={location.pathname.endsWith(
                `teams/${saveGame.humanTeamID}/players`
              )}
            >
              <ListItemText primary={"My Players"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Lineup"} disablePadding>
            <ListItemButton
              onClick={() => navigate(`lineup`)}
              selected={location.pathname.endsWith("lineup")}
            >
              <ListItemText primary={"Lineup"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Teams"} disablePadding>
            <ListItemButton
              onClick={() => navigate("teams")}
              selected={location.pathname.endsWith("teams")}
            >
              <ListItemText primary={"Teams"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Leagues"} disablePadding>
            <ListItemButton
              onClick={() => navigate("leagues")}
              selected={location.pathname.endsWith("leagues")}
            >
              <ListItemText primary={"Leagues"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Schedule"} disablePadding>
            <ListItemButton
              onClick={() => navigate("schedule")}
              selected={location.pathname.endsWith("schedule")}
            >
              <ListItemText primary={"Schedule"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Standings"} disablePadding>
            <ListItemButton
              onClick={() => navigate("standings")}
              selected={location.pathname.endsWith("standings")}
            >
              <ListItemText primary={"Standings"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Button onClick={handlePlayClick}>Play!</Button>
      </Drawer>
      <Box sx={{ marginLeft: `${drawerWidth}px` }}>
        <Outlet />
      </Box>
    </SaveGameContext.Provider>
  );
};

export default SaveGameLayout;
