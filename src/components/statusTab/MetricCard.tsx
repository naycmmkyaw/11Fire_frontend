import React from "react";
import { Box } from "@mui/material";

interface MetricCardProps {
  children: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ children }) => {
  return (
    <Box sx={{ flex: "1 1 400px", minWidth: "300px" }}>
      {children}
    </Box>
  );
};

export default MetricCard;
