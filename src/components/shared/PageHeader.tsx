import React from "react";
import { Box, Typography} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import AvatarMenu from "./AvatarMenu";

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    const { user,logout } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#000000" }}>
        {title}
      </Typography>
      <AvatarMenu user={user} onLogout={logout} />
    </Box>
  );
};

export default PageHeader;
