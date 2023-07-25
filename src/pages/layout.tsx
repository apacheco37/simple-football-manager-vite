import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box sx={{ padding: "2rem" }}>
      <Outlet />
    </Box>
  );
};

export default Layout;
