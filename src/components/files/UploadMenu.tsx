import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
// import FolderIcon from "@mui/icons-material/Folder";

interface UploadMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onFileUpload: () => void;
  // onFolderUpload: () => void;
}

const UploadMenu: React.FC<UploadMenuProps> = ({ 
  anchorEl, 
  onClose, 
  onFileUpload, 
  // onFolderUpload 
}) => {
  const menuItems = [
    { icon: DescriptionIcon, label: "Upload File", action: onFileUpload },
    // { icon: FolderIcon, label: "Upload Folder", action: onFolderUpload },
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#fff7ed",
          boxShadow: 3,
          borderRadius: 3,
          px: 1,
          py: 0.5,
        },
      }}
    >
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          onClick={item.action}
          sx={{ 
            borderRadius: "12px", 
            "&:hover": { bgcolor: "#f3ede1" } 
          }}
        >
          <ListItemIcon>
            <item.icon fontSize="small" sx={{ color: "#e17d5f" }} />
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </MenuItem>
      ))}
    </Menu>
  );
};

export default UploadMenu;
