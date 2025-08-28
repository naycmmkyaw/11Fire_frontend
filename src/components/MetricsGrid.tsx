import React from "react";
import { Box } from "@mui/material";

interface MetricsGridProps {
  children: React.ReactNode;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
      {children}
    </Box>
  );
};

export default MetricsGrid;
