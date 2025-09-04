import React from "react";
import { Box } from "@mui/material";

interface MetricCardProps {
  children: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ children }) => {
  return (
    <Box sx={{ 
      flex: "1 1 400px", 
      minWidth: "300px",
      maxWidth: { xs: "100%", sm: "500px", md: "600px", lg: "700px", xl: "800px" },
      width: { xs: "100%", sm: "calc(50% - 12px)", md: "calc(50% - 12px)", lg: "calc(50% - 12px)", xl: "calc(50% - 12px)" }
    }}>
      {children}
    </Box>
  );
};

export default MetricCard;
