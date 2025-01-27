import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
            >
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
