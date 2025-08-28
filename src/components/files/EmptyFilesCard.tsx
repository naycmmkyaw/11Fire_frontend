import React from "react";
import { Box, Typography} from "@mui/material";

const EmptyFilesCard: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: 'secondary.main',
        border: "1px solid #d6cfc1",
        borderRadius: 3,
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: 1,
      }}
    >
      <Typography sx={{ color: "#3c3c3c", fontWeight: 300 }}>
        No files yet. Tap the <strong>Add</strong> button to upload your first file.
      </Typography>
    </Box>
  );
};

export default EmptyFilesCard;