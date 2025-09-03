import React from "react";
import { Button, Menu, MenuItem, Typography, Divider, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Icon } from "@iconify/react";

interface GroupDropdownProps {
  anchorEl: HTMLElement | null;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  isMobile: boolean;
}

const GroupDropdown: React.FC<GroupDropdownProps> = ({ 
  anchorEl, 
  onOpen, 
  onClose, 
  isMobile 
}) => (
  <>
    <Button
      onClick={onOpen}
      sx={{
        borderRadius: 2,
        bgcolor: isMobile ? "#fff" : "#fff7ed",
        border: `1px solid ${isMobile ? "#e0e0e0" : "#b5b5b5"}`,
        px: 3,
        height: 36,
        fontWeight: 500,
        fontSize: "1rem",
        color: "#333",
        textTransform: "none",
        minWidth: 200,
        justifyContent: "space-between",
      }}
    >
      Nay Che's group
      <Icon icon="ri:arrow-drop-down-line" style={{ marginLeft: 8, fontSize: 25 }} />
    </Button>
    
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: isMobile ? "#fff" : "#fff5e9",
          borderRadius: 3,
          px: 2,
          py: 1.5,
          minWidth: 200,
          boxShadow: 3,
        },
      }}
    >
      <Typography
        sx={{ fontWeight: 700, color: "#ef4444", px: 1.5, pb: 1, fontSize: "1.2rem" }}
      >
        Nay Che's group
      </Typography>
      <Typography sx={{ px: 1.5, pb: 1, color: "#333" }}>
        Su Lei's group
      </Typography>
      <Divider sx={{ my: 1 }} />
      <MenuItem>
        <AddIcon fontSize="small" sx={{ color: "#ef4444", mr: 1 }} />
        Create new
      </MenuItem>
      <MenuItem>
        <AddIcon fontSize="small" sx={{ color: "#ef4444", mr: 1 }} />
        Join group
      </MenuItem>
    </Menu>
  </>
);

export default GroupDropdown;
