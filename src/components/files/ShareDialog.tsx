import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  fileName: string;
  setFileName: (name: string) => void;
  isFileShare: boolean;
  isSharing?: boolean;
  shareError?: string | null;
  targetName?: string;
  onSubmit: () => void;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onClose,
  fileName,
  setFileName,
  isFileShare,
  onSubmit,
  isSharing = false,
  shareError = null,
  targetName,
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
      Sharing "{targetName}"
    </DialogTitle>
    <DialogContent>
      <Typography sx={{ mb: 1, fontSize: "1rem" }}>
        Share with
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Recipient emails"
        placeholder="name@example.com, teammate@example.com"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isSharing) {
            e.preventDefault();
            onSubmit();
          }
        }}
        sx={{ bgcolor: "secondary.main", borderRadius: 2 }}
        helperText={shareError || "Separate email addresses with commas or spaces."}
        error={Boolean(shareError)}
      />
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
        onClick={onSubmit}
        sx={{
          borderRadius: 2,
          bgcolor: "primary.main",
          color: "#fff",
          "&:hover": { bgcolor: "#dc2626" },
        }}
      >
        Share
      </Button>
    </DialogActions>
  </Dialog>
);

export default ShareDialog;
