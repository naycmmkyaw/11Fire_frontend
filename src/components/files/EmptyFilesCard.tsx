import React from "react";
import { Box, Typography} from "@mui/material";

interface EmptyFilesCardProps {
  isMobile?: boolean;
  activeTab?: 'my-files' | 'shared-with-me';
}

const EmptyFilesCard: React.FC<EmptyFilesCardProps> = ({ isMobile = false, activeTab = 'my-files' }) => {
  const getMessage = () => {
    if (activeTab === 'shared-with-me') {
      return <>No one has shared a file with you yet.</>;
    }
    return (
      <>
        No files yet. Tap the{" "}
        <Box component="span" sx={{ fontWeight: 700, display: "inline" }}>
          Add
        </Box>
        {" "}button to upload your first file.
      </>
    );
  };
  if (isMobile) {
    // Mobile view - match the image exactly
    return (
      <Box
        sx={{
          bgcolor: 'secondary.main',
          border: "1px solid #e0e0e0",
          borderRadius: 3,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 1,
          px: 3,
          textAlign: "center",
        }}
      >
        <Typography sx={{ 
          color: "#666", 
          fontWeight: 400,
          fontSize: "1rem",
          lineHeight: 1.5,
        }}>
          {getMessage()}
        </Typography>
      </Box>
    );
  }

  // Desktop view - keep original styling
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
        {getMessage()}
      </Typography>
    </Box>
  );
};

export default EmptyFilesCard;