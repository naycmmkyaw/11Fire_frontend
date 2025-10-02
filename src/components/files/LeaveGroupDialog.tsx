import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface LeaveGroupDialogProps {
  open: boolean;
  groupName: string;
  isLeaving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LeaveGroupDialog: React.FC<LeaveGroupDialogProps> = ({
  open,
  groupName,
  isLeaving,
  onCancel,
  onConfirm,
}) => (
  <Dialog
    open={open}
    onClose={onCancel}
    maxWidth="sm"
    fullWidth
    slotProps={{
      paper: {
        sx: {
          borderRadius: 3,
          bgcolor: "#FFF4E7",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        },
      },
    }}
  >
    <DialogTitle sx={{ p: 3, pb: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Leave group
        </Typography>
        <IconButton onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>

    <DialogContent sx={{ px: 3, py: 0 }}>
      <Typography variant="body1" sx={{ color: "#000000", fontSize: "1rem" }}>
        Are you sure you want to leave group {groupName || "this group"}?
      </Typography>
    </DialogContent>

    <DialogActions sx={{ justifyContent: "flex-end", mt: 2, p: 3 }}>
      <Button
        onClick={onCancel}
        sx={{
          bgcolor: "#FEE6E6",
          color: "#000",
          borderRadius: 1.2,
          textTransform: "none",
          px: 3,
          height: 36,
          "&:hover": { bgcolor: "#fdd8d8" },
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onConfirm}
        disabled={isLeaving}
        sx={{
          bgcolor: "primary.main",
          color: "#fff",
          borderRadius: 1.2,
          textTransform: "none",
          px: 3,
          height: 36,
          "&:hover": { bgcolor: "#e14848" },
          "&:disabled": { bgcolor: "#ccc", color: "#666" },
        }}
      >
        {isLeaving ? "Leaving..." : "Leave"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default LeaveGroupDialog;