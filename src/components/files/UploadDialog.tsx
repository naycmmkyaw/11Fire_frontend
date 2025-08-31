import React from "react";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Typography 
} from "@mui/material";

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  fileName: string;
  setFileName: (name: string) => void;
  isRenameMode: boolean;
  isFileUpload: boolean;
  isUploading?: boolean;
  uploadError?: string | null;
  onSubmit: () => void;
}

const UploadDialog: React.FC<UploadDialogProps> = ({ 
  open, 
  onClose, 
  fileName, 
  setFileName, 
  isRenameMode, 
  isFileUpload,
  onSubmit 
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        borderRadius: 3,
        px: 4,
        pt: 3,
        pb: 2,
        bgcolor: "#fff7ed",
        minWidth: 400,
      },
    }}
  >
    <DialogTitle sx={{ fontWeight: 600, fontSize: "1.4rem", mb: 1 }}>
      {isRenameMode ? "Rename" : `${isFileUpload ? "File" : "Folder"} Upload`}
    </DialogTitle>
    <DialogContent>
      <Typography sx={{ mb: 1, fontSize: "1rem" }}>
        Confirm file name
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        sx={{ bgcolor: "#fff7ed", borderRadius: 2 }}
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
          bgcolor: "#ef4444",
          color: "#fff",
          "&:hover": { bgcolor: "#dc2626" },
        }}
      >
        {isRenameMode ? "Rename" : "Upload"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default UploadDialog;
