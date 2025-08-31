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
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface GroupDialogProps {
  open: boolean;
  onClose: () => void;
  groupName: string;
  passcode: string;
  setGroupName: (name: string) => void;
  setPasscode: (passcode: string) => void;
  isJoinMode: boolean;
  onSubmit: () => void;
  radioValue: string;
  setRadioValue: (value: string) => void;
}

const GroupDialog: React.FC<GroupDialogProps> = ({
  open,
  onClose,
  groupName,
  setGroupName,
  passcode,
  setPasscode,
  isJoinMode,
  onSubmit,
  radioValue,
  setRadioValue,
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
      {isJoinMode ? "Join Group" : "Create Group"}
    </DialogTitle>
    <DialogContent>
      <Typography sx={{ mb: 1, fontSize: "1rem" }}>Enter group name</Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        sx={{ bgcolor: "secondary.main", borderRadius: 2, mb: 2 }}
      />
      <Typography sx={{ mb: 1, fontSize: "1rem" }}>Enter group passcode</Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Passcode"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        sx={{ bgcolor: "secondary.main", borderRadius: 2, mb: 2 }}
      />
      <Typography sx={{ mb: 1, fontSize: "1rem" }}>Choose to:</Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <RadioGroup
          row
          value={radioValue}
          onChange={(e) => setRadioValue(e.target.value)}
        >
          <FormControlLabel
            value="user"
            control={<Radio />}
            label="Store data"
          />
          <FormControlLabel
            value="provider"
            control={<Radio />}
            label="Provide storage"
          />
        </RadioGroup>
      </Box>
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
        {isJoinMode ? "Join" : "Create"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default GroupDialog;
