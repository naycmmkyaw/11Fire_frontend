import React from "react";
import { Button, Menu, MenuItem, Typography, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Icon } from "@iconify/react";
import type { GroupMembership } from "../../services/getGroupList";

interface GroupDropdownProps {
  anchorEl: HTMLElement | null;
  onOpen: (event: React.MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  isMobile: boolean;
  groups: GroupMembership[];
  selectedGroup: GroupMembership | null;
  onGroupSelect: (group: GroupMembership) => void;
  onCreateGroup: () => void;
  onJoinGroup: () => void;
  isLoading?: boolean;
}

const GroupDropdown: React.FC<GroupDropdownProps> = ({ 
  anchorEl, 
  onOpen, 
  onClose, 
  isMobile,
  groups,
  selectedGroup,
  onGroupSelect,
  onCreateGroup,
  onJoinGroup,
  isLoading = false
}) => {
  const displayName = selectedGroup?.swarmName || "Select a group";

  return (
    <>
      <Button
        onClick={onOpen}
        disabled={isLoading}
        sx={{
          borderRadius: 2,
          bgcolor: isMobile ? "#fff" : 'secondary.main',
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
        {isLoading ? "Loading..." : displayName}
        <Icon icon="ri:arrow-drop-down-line" style={{ marginLeft: 8, fontSize: 25 }} />
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{
          sx: {
            bgcolor: isMobile ? "#fff" : "secondary.dark",
            borderRadius: 3,
            px: 2,
            py: 1.5,
            minWidth: 200,
            maxHeight: 300,
            overflowY: 'auto',
            boxShadow: 3,
          },
        }}
      >
        {groups.length === 0 ? (
          <Typography sx={{ px: 1.5, py: 1, color: "#666", fontStyle: 'italic' }}>
            No groups found
          </Typography>
        ) : (
          groups.map((group) => (
            <MenuItem
              key={group.swarmId}
              onClick={() => {
                onGroupSelect(group);
                onClose();
              }}
              sx={{
                px: 1.5,
                py: 0.5,
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: selectedGroup?.swarmId === group.swarmId ? 700 : 400,
                  color: selectedGroup?.swarmId === group.swarmId ? "#ef4444" : "#333",
                  fontSize: selectedGroup?.swarmId === group.swarmId ? "1.1rem" : "1rem",
                }}
              >
                {group.swarmName || `Group ${group.swarmId.slice(0, 8)}...`}
              </Typography>
            </MenuItem>
          ))
        )}
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem onClick={() => { onCreateGroup(); onClose(); }}>
          <AddIcon fontSize="small" sx={{ color: "#ef4444", mr: 1 }} />
          Create new
        </MenuItem>
        <MenuItem onClick={() => { onJoinGroup(); onClose(); }}>
          <AddIcon fontSize="small" sx={{ color: "#ef4444", mr: 1 }} />
          Join group
        </MenuItem>
      </Menu>
    </>
  );
};

export default GroupDropdown;