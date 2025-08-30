import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";

interface FileActionsMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onRename: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

const FileActionsMenu: React.FC<FileActionsMenuProps> = ({ 
  anchorEl, 
  onClose, 
  onRename, 
  onDownload, 
  onDelete 
}) => {
  const menuItems = [
    { icon: EditIcon, label: "Rename", action: onRename },
    { icon: FileDownloadIcon, label: "Download", action: onDownload },
    { icon: DeleteIcon, label: "Delete", action: onDelete },
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

export default FileActionsMenu;
