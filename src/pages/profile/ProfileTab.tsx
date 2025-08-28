import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  DialogActions,
  Dialog,
  IconButton,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ActionButton from "../../components/shared/ActionButton";
import ResponsiveHeader from "../../components/shared/ResponsiveHeader";
import { useNavigate } from "react-router-dom";

interface ProfileTabContentProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isProviderDashboard: boolean;
  onTabChange?: (tab: string) => void;
}

const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
  selectedTab,
  setSelectedTab,
  isProviderDashboard,
  onTabChange
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1, px: 1, py: 1 }}>
      <ResponsiveHeader 
        title="PROFILE" 
        avatarText="N" 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isProviderDashboard={isProviderDashboard}
        onTabChange={onTabChange}
      />

      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <AccountCircleOutlinedIcon
          sx={{ fontSize: 125, color: "text.primary" }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
          Username
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value="nc_mmk"
          sx={{
            borderRadius: 1,
            bgcolor: "background.primary",
            boxShadow: 1,
            border: "1px",
          }}
          InputProps={{ readOnly: true }}
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
          Email
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value="nc_mmk@kmutt.ac.th"
          sx={{
            borderRadius: 1,
            border: "1px ",
            bgcolor: "background.primary",
            boxShadow: 2,
          }}
          InputProps={{ readOnly: true }}
        />
      </Box>
      <ActionButton
        variant="primary"
        onClick={() => setDialogOpen(true)}
      >
        Sign out
      </ActionButton>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "#FFF1E5",
            px: 3,
            pt: 2,
            pb: 3,
            minWidth: 360,
            boxShadow: "0px 3px 10px rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Do you want to sign out?
          </Typography>
          <IconButton onClick={() => setDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogActions sx={{ justifyContent: "flex-end", mt: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            sx={{
              bgcolor: "#FEE6E6",
              color: "#000",
              borderRadius: 2,
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
            onClick={() => {
              // Add sign-out logic here
              navigate("/auth/signin");
            }}
            sx={{
              bgcolor: "primary.main",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              height: 36,
              "&:hover": { bgcolor: "#e14848" },
            }}
          >
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileTabContent;