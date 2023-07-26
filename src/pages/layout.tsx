import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Simple Football Manager
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        {/* https://mui.com/material-ui/react-app-bar/#fixed-placement */}
      </Box>
      <Box sx={{ padding: "2rem" }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
