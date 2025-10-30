import React from "react";
import { Paper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  isMobile?: boolean;
  value: string;
  onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onSearch, isMobile }) => (
  <Paper
    elevation={0}
    sx={{
      display: "flex",
      alignItems: "center",
      bgcolor: "#f1e9dd",
      borderRadius: 1.2,
      width: { xs: "auto", sm: "auto", md: 300, lg: 500 },
      // minWidth: isMobile ? 220 : undefined,
      height: 36,
      px: 2,
      mb: isMobile ? 2 : 0,
    }}
  >
    <SearchIcon sx={{ color: "#5f5a54", mr: 1 }} />
    <TextField
      placeholder="Search files"
      variant="standard"
      value={value}
      onChange={(event) => onSearch(event.target.value)}
      InputProps={{
        disableUnderline: true,
        sx: { fontSize: "0.9rem", color: "#5f5a54" },
      }}
      fullWidth
    />
  </Paper>
);

export default SearchBar;
