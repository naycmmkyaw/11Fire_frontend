import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  fileName,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    slotProps={{
      paper: {
        sx: {
          borderRadius: 3,
          px: 4,
          pt: 3,
          pb: 2,
          bgcolor: "secondary.dark",
          minWidth: 400,
          position: "relative",
        },
      },
    }}
  >
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{
        position: "absolute",
        right: 12,
        top: 12,
        color: "#888",
      }}
      size="large"
    >
      <CloseIcon />
    </IconButton>
    
    <DialogTitle sx={{ fontWeight: 600, fontSize: "1.4rem", mb: 1 }}>
      Delete File
    </DialogTitle>
    
    <DialogContent>
      <Typography sx={{ mb: 2, fontSize: "1rem" }}>
        Are you sure you want to delete this file?
      </Typography>
      <Typography sx={{ 
        fontWeight: 500, 
        color: "primary.main",
        p: 1,
        borderRadius: 1,
        wordBreak: "break-all"
      }}>
        {fileName}
      </Typography>
      <Typography sx={{ mt: 2, fontSize: "0.9rem", color: "#666" }}>
        This action cannot be undone.
      </Typography>
    </DialogContent>
    
    <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 2 }}>
      <Button
        variant="outlined"
        onClick={onClose}
        sx={{ borderRadius: 2, color: "#3c3c3c", borderColor: "#ccc" }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        onClick={onConfirm}
        sx={{
          borderRadius: 2,
          bgcolor: "#ef4444",
          color: "#fff",
          "&:hover": { bgcolor: "#dc2626" },
        }}
      >
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteConfirmDialog;