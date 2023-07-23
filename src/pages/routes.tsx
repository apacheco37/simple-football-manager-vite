import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout";
import Leagues from "./leagues";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to={"/leagues"} />} />
        <Route path="leagues" element={<Leagues />} />

        {/* Using path="*"" means "match anything", so this route
                acts like a catch-all for URLs that we don't have explicit
                routes for. */}
        {/* <Route path="*" element={<NoMatch />} /> */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
