import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { providerNodeService } from "../../services/providerNodeService";

interface StorageCardProps {
  totalStorage: string;
  remainingStorage: string;
  usedStorage: number;
  onStorageUpdate: (newStorage: string) => void;
}

const StorageCard: React.FC<StorageCardProps> = ({
  totalStorage,
  remainingStorage,
  usedStorage,
  onStorageUpdate,
}) => {
  // State for settings dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // State for Set Storage modal
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [storageAmount, setStorageAmount] = useState("10 GB");

  // State for loading dialog
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState(false);
  
  // State for quota data
  const [quotaData, setQuotaData] = useState<Awaited<ReturnType<typeof providerNodeService.getActiveQuotaUsage>> | null>(null);
  const [isLoadingQuota, setIsLoadingQuota] = useState(false);

  // Fetch quota data on component mount
  useEffect(() => {
    fetchQuotaData();
  }, []);

  const fetchQuotaData = async () => {
    try {
      setIsLoadingQuota(true);
      const data = await providerNodeService.getActiveQuotaUsage();
      setQuotaData(data);
      console.log(data);
    } catch (err) {
      console.error('Failed to fetch quota data:', err);
    } finally {
      setIsLoadingQuota(false);
    }
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleSetStorageClick = () => {
    setIsStorageModalOpen(true);
    handleSettingsClose();
  };

  const handleStorageModalClose = () => {
    setIsStorageModalOpen(false);
  };

  const handleSetStorage = async () => {
    setIsStorageModalOpen(false);
    setIsLoadingDialogOpen(true);

    try {
      // Extract numeric value from storageAmount (e.g., "10 GB" -> 10)
      const quotaGB = parseFloat(storageAmount.split(' ')[0]);
      
      if (isNaN(quotaGB)) {
        throw new Error('Invalid storage amount');
      }

      // Call the backend API to set quota
      await providerNodeService.setActiveSwarmQuota(quotaGB);
      
      // Refresh quota data
      await fetchQuotaData();
      
      // Update parent component
      onStorageUpdate(storageAmount);
    } catch (err) {
      console.error('Failed to set storage quota:', err);
    } finally {
      setIsLoadingDialogOpen(false);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "secondary.main",
        border: "1px solid #e5e7eb",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "#000000", fontSize: '1.125rem', mb: 2 }}
      >
        Storage Filled
      </Typography>
      
      {/* Separator line */}
      <Box 
        sx={{ 
          height: '1px', 
          bgcolor: '#E5E7EB', 
          mb: 2,
          width: '100%'
        }} 
      />
      
      {/* Settings button positioned after divider */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <IconButton
          onClick={handleSettingsClick}
          sx={{ color: "primary.main" }}
        >
          <SettingsIcon sx={{ fontSize: 28 }} />
        </IconButton>
        {isLoadingQuota && (
          <CircularProgress 
            size={16} 
            sx={{ 
              position: 'absolute', 
              top: -8, 
              right: -8, 
              color: '#EB6464' 
            }} 
          />
        )}
      </Box>

      {/* Settings Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleSetStorageClick}>
          <EditIcon sx={{ mr: 1, fontSize: 20, color: "primary.main" }} />
          Set storage
        </MenuItem>
      </Menu>

      {/* Circular Progress */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: 160,
            height: 160,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* SVG for Circular Progress */}
          <svg width="160" height="160" style={{ position: "absolute" }}>
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="20"
            />

            {/* Progress Circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#EB6464"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${
                2 * Math.PI * 70 * (1 - (quotaData && quotaData.percentUsed !== null ? quotaData.percentUsed : usedStorage) / 100)
              }`}
              transform="rotate(-90 80 80)"
              style={{
                transition: "stroke-dashoffset 0.5s ease-in-out",
              }}
            />
          </svg>

          {/* Content */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "#000000" }}
            >
              {quotaData && quotaData.percentUsed !== null ? `${quotaData.percentUsed}%` : `${usedStorage}%`}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", fontSize: "0.75rem" }}
            >
              Used
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Storage Details at Bottom of Card */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ color: "#000000", mb: 0.5 }}>
            Total
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#000000", fontWeight: 600 }}
          >
            {quotaData && quotaData.quotaGB ? `${quotaData.quotaGB} GB` : totalStorage}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: "#000000", mb: 0.5 }}>
            Remaining
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#000000", fontWeight: 600 }}
          >
            {quotaData && quotaData.quotaGB ? `${(quotaData.quotaGB - quotaData.usedGB).toFixed(1)} GB` : remainingStorage}
          </Typography>
        </Box>
      </Box>

      {/* Set Storage Modal Dialog */}
      <Dialog
        open={isStorageModalOpen}
        onClose={handleStorageModalClose}
        maxWidth="sm"
        fullWidth
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
          onClick={handleStorageModalClose}
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
          Set Storage
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ mb: 1, fontSize: "1rem" }}>
            Storage amount
          </Typography>
          <TextField
            fullWidth
            value={storageAmount}
            onChange={(e) => setStorageAmount(e.target.value)}
            placeholder="Enter Amount (eg. 1 TB)*"
            variant="outlined"
            sx={{ bgcolor: "secondary.main", borderRadius: 2 }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleStorageModalClose}
            sx={{ 
              borderRadius: 2, 
              color: "#3c3c3c", 
              borderColor: "#ccc",
              px: 3,
              py: 1.5,
              minWidth: "100px",
              fontSize: "1rem"
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSetStorage}
            sx={{
              borderRadius: 2,
              bgcolor: "primary.main",
              color: "#fff",
              px: 3,
              py: 1.5,
              minWidth: "100px",
              fontSize: "1rem",
              "&:hover": { bgcolor: "#dc2626" },
            }}
          >
            Set
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading Dialog */}
      <Dialog
        open={isLoadingDialogOpen}
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
            Setting Storage
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
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
              Setting storage amount, please wait...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default StorageCard;
