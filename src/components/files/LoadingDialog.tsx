import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

interface LoadingDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  loadingText: string;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({
  open,
  title,
  loadingText,
}) => (
  <Dialog
    open={open}
    maxWidth="sm"
    fullWidth
    slotProps={{
      paper: {
        sx: {
          borderRadius: 4,
          bgcolor: "secondary.dark",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          minHeight: "200px",
        },
      },
    }}
  >
    <DialogTitle
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        pb: 1,
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: "1.4rem", mb: 1 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center",}}>
        <CircularProgress size={24} sx={{ color: "primary.main" }} />
      </Box>
    </DialogTitle>

    <DialogContent sx={{ px: 3, py: 0 }}>
      <Box sx={{ textAlign: "left", py: 1 }}>
        <Typography
          variant="body1"
          sx={{
            color: "#000000",
            fontSize: "1rem",
            lineHeight: 1,
          }}
        >
          {loadingText}
        </Typography>
      </Box>
    </DialogContent>
  </Dialog>
);

export default LoadingDialog;
