import React from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AddButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => (
  <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={onClick}
    sx={{
      bgcolor: "#ef4444",
      color: "#fff",
      borderRadius: 1.2,
      textTransform: "none",
      px: 3,
      height: 36,
      fontWeight: 500,
    }}
  >
    Add
  </Button>
);

export default AddButton;
