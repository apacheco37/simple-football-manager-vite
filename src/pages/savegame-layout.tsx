import { useLiveQuery } from "dexie-react-hooks";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { SaveGame, db } from "../db/db";
import { createContext } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";

export const SaveGameContext = createContext<{ saveGame: SaveGame }>(
  {} as { saveGame: SaveGame }
);

const drawerWidth = 180;

const SaveGameLayout = () => {
  const { savegameid } = useParams();
  const saveGame = useLiveQuery(() => db.saveGame.get(Number(savegameid)));
  const navigate = useNavigate();
  const location = useLocation();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!saveGame) return <></>;

  return (
    <SaveGameContext.Provider value={{ saveGame }}>
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
          <ListItem key={"Teams"} disablePadding>
            <ListItemButton
              onClick={() => navigate("teams")}
              selected={location.pathname.endsWith("teams")}
            >
              <ListItemText primary={"Teams"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Players"} disablePadding>
            <ListItemButton /* onClick={() => navigate("players")} */>
              <ListItemText primary={"Players"} />
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
        </List>
      </Drawer>
      <Box sx={{ marginLeft: `${drawerWidth}px` }}>
        <Outlet />
      </Box>
    </SaveGameContext.Provider>
  );
};

export default SaveGameLayout;
