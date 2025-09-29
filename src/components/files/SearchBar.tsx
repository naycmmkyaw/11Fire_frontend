import React from "react";
import { Paper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar: React.FC = () => (
  <Paper
    elevation={0}
    sx={{
      display: "flex",
      alignItems: "center",
      bgcolor: "#f1e9dd",
      borderRadius: 1.2,
      width: 500,
      height: 36,
      px: 2,
    }}
  >
    <SearchIcon sx={{ color: "#5f5a54", mr: 1 }} />
    <TextField
      placeholder="Search"
      variant="standard"
      InputProps={{
        disableUnderline: true,
        sx: { fontSize: "0.9rem", color: "#6B7280" },
      }}
      fullWidth
    />
  </Paper>
);

export default SearchBar;
