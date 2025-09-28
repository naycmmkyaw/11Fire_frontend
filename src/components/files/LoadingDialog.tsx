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
          borderRadius: 3,
          bgcolor: "#FFF4E7",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          minHeight: "200px",
        },
      },
    }}
  >
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        p: 3,
        pb: 2,
      }}
    >
      <CircularProgress 
        size={24} 
        sx={{ 
          color: "#ef4444", // Red spinner
          mr: 2 
        }} 
      />
      <Typography sx={{ 
        fontWeight: 600, 
        fontSize: "1.2rem",
        color: "#000000"
      }}>
        {title}
      </Typography>
    </DialogTitle>

    <DialogContent sx={{ px: 3, py: 0 }}>
      <Box sx={{ textAlign: "left", py: 1 }}>
        <Typography
          variant="body1"
          sx={{
            color: "#000000",
            fontSize: "1rem",
            lineHeight: 1.5,
            mb: 2,
          }}
        >
          Please do not close this modal or close your browser.
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#000000",
            fontSize: "1rem",
            lineHeight: 1.5,
            fontWeight: 500,
          }}
        >
          {loadingText}
        </Typography>
      </Box>
    </DialogContent>
  </Dialog>
);

export default LoadingDialog;
