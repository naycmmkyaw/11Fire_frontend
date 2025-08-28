import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  IconButton,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { FileEntry } from "../../types";

interface FilesTableProps {
  files: FileEntry[];
  onCopyCid: (cid: string) => void;
  onOpenFileMenu: (event: React.MouseEvent<HTMLElement>, index: number) => void;
}

const truncateCid = (cid: string) => cid.slice(0, 6) + "..." + cid.slice(-4);

const FilesTable: React.FC<FilesTableProps> = ({ files, onCopyCid, onOpenFileMenu }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, bgcolor: "#fefaf4" }}
    >
      <Table>
        <TableHead sx={{ bgcolor: "#f3ede1" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell>
              <strong>CID</strong>
            </TableCell>
            <TableCell>
              <strong>Size</strong>
            </TableCell>
            <TableCell>
              <strong>Creation Date</strong>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, idx) => (
            <TableRow key={idx} hover sx={{ bgcolor: "#fffaf3" }}>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell sx={{ maxWidth: 250 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {file.isFile ? (
                    <InsertDriveFileIcon sx={{ color: "#e17d5f", mr: 1 }} />
                  ) : (
                    <FolderIcon sx={{ color: "#e17d5f", mr: 1 }} />
                  )}
                  {file.name}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {truncateCid(file.cid)}
                  <IconButton
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => onCopyCid(file.cid)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell>{file.date}</TableCell>
              <TableCell align="right">
                <IconButton onClick={(e) => onOpenFileMenu(e, idx)}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FilesTable;