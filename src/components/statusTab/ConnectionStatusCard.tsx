import React from "react";
import { Box, Typography, Paper, Link} from "@mui/material";
import useIsMobile from "../../hooks/useMobile";

interface ConnectionStatusCardProps {
  isConnected: boolean;
  onSetupClick: () => void;
}

const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({
  isConnected,
  onSetupClick,
}) => {
  const isMobile = useIsMobile();
  if (isConnected) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          bgcolor: 'secondary.main',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#000000", mb: 2 }}
        >
          Connected to Peers
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 0.5, alignItems: isMobile ? "flex-start" : "center" }}>
            <Typography variant="body1" sx={{ color: "#000000", fontWeight: 600, whiteSpace: "nowrap" }}>
              Peer ID:
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: "#000000",
                wordBreak: "break-all",
                fontSize: isMobile ? "0.875rem" : "1rem"
              }}
            >
              12D3KooWQJtfU4jS8u8nsUvVxRMeTeRY5qBtBHRtxMqsKFYDkJkp
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "#000000" }}>
            <strong>Version:</strong> go-ipfs v0.34.1
          </Typography>
          <Typography variant="body1" sx={{ color: "#000000" }}>
            <strong>Peers:</strong> 10
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        height: "200px",
        bgcolor: "secondary.main",
        border: "1px solid #e5e7eb",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "#000000", mb: 1 }}
      >
        Not Connected to Peers
      </Typography>
      <Typography variant="body1" sx={{ color: "#000000" }}>
        You are not connected to any group. Need a quick{" "}
        <Link
          component="button"
          onClick={onSetupClick}
          sx={{
            color: "primary.main",
            textDecoration: "underline",
            cursor: "pointer",
            border: "none",
            background: "none",
            padding: 0,
            font: "inherit",
            "&:hover": { color: "primary.dark" },
          }}
        >
          setup?
        </Link>
      </Typography>
    </Paper>
  );
};

export default ConnectionStatusCard;
