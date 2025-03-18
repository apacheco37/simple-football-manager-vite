import { Typography } from "@mui/material";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { SaveGameContext } from "../pages/savegame-layout";

type TypographyLinkProps = {
  text: string;
  link: string;
};

const TypographyLink = ({ text, link }: TypographyLinkProps) => {
  const {
    saveGame: { id },
  } = useContext(SaveGameContext);

  return (
    <Typography
      component={Link}
      to={`/save-games/${id}/${link}`}
      sx={{
        flexGrow: 1,
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
          textDecoration: "underline",
        },
      }}
    >
      {text}
    </Typography>
  );
};

export default TypographyLink;
