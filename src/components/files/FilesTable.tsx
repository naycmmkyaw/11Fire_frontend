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
  Button,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { Icon } from "@iconify/react";
import type { FileEntry, SharedFileEntry } from "../../types";

interface FilesTableProps {
  files: FileEntry[] | SharedFileEntry[];
  onCopyCid: (cid: string) => void;
  onOpenFileMenu: (event: React.MouseEvent<HTMLElement>, index: number) => void;
  onOpenFileInfo: (event: React.MouseEvent<HTMLElement>, index: number) => void;
  isMobile?: boolean;
  selectedFiles: Set<number>;
  onSelectAll: (checked: boolean) => void;
  onSelectFile: (index: number, checked: boolean) => void;
  onBulkDownload?: () => void;
  onBulkDelete?: () => void;
  isSharedFiles?: boolean;
  onDownloadFile: (cid: string, fileName: string) => void;
}

const truncateCid = (cid: string) => cid.slice(0, 6) + "..." + cid.slice(-4);

const isSharedFile = (file: FileEntry | SharedFileEntry): file is SharedFileEntry => {
  return 'sharedBy' in file;
};

const FilesTable: React.FC<FilesTableProps> = ({ 
  files, 
  onCopyCid, 
  onOpenFileMenu,
  onOpenFileInfo, 
  isMobile = false,
  selectedFiles,
  onSelectAll,
  onSelectFile,
  onBulkDownload,
  onBulkDelete,
  isSharedFiles = false,
  onDownloadFile
}) => {
  if (isMobile) {
    return (
      <TableContainer
        component={Paper}
        sx={{ 
          borderRadius: 2, 
          bgcolor: "secondary.main",
          maxWidth: "100vw",
          overflowX: "hidden"
        }}
      >
        <Table sx={{ minWidth: "auto", tableLayout: "fixed" }}>
          <TableHead sx={{ bgcolor: "#f4eade" }}>
            <TableRow>
              <TableCell padding="checkbox" sx={{ width: "10%", minWidth: 40, px: 1 }}>
                <Checkbox 
                  checked={files.length > 0 && selectedFiles.size === files.length}
                  indeterminate={selectedFiles.size > 0 && selectedFiles.size < files.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </TableCell>
              {selectedFiles.size > 0 ? (
                <>
                  <TableCell sx={{ width: "75%", minWidth: 250, overflow: "visible", px: 1 }}>
                    <Box sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 1.5,
                      flexWrap: "nowrap",
                      minWidth: 0
                    }}>
                      <Box sx={{ 
                        whiteSpace: "nowrap", 
                        flexShrink: 0,
                        fontWeight: "bold"
                      }}>
                        {selectedFiles.size} selected
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Icon icon="mingcute:download-fill" />}
                        sx={{ 
                          bgcolor: "#ef4444", 
                          color: "white", 
                          fontSize: "0.8rem", 
                          px: 1.5, 
                          py: 0.5,
                          minWidth: "auto",
                          flexShrink: 0,
                          "&:hover": { bgcolor: "#dc2626" }
                        }}
                        onClick={onBulkDownload}
                      >
                        Download
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Icon icon="ic:round-delete" />}
                        sx={{ 
                          fontSize: "0.8rem", 
                          px: 1.5, 
                          py: 0.5,
                          minWidth: "auto",
                          flexShrink: 0,
                          bgcolor: "#FFFFFF",
                          borderColor: "#FFFFFF",
                          color: "#EB6464",
                          "&:hover": {
                            bgcolor: "#FFFFFF",
                            borderColor: "#FFFFFF",
                            color: "#EB6464",
                            boxShadow: "none"
                          },
                          "&:focus": {
                            boxShadow: "none"
                          },
                          "&:active": {
                            boxShadow: "none"
                          }
                        }}
                        onClick={onBulkDelete}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "15%", minWidth: 80, px: 1 }} />
                  <TableCell sx={{ width: "10%", minWidth: 80, px: 1 }} />
                </>
              ) : (
                <>
                  <TableCell sx={{ width: "45%", minWidth: 100, overflow: "hidden", px: 1, pr: 0.25 }}>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell sx={{ width: "35%", minWidth: 100, px: 1, pl: 0.25 }}>
                    <strong>{isSharedFiles ? "Shared by" : "CID"}</strong>
                  </TableCell>
                  <TableCell sx={{ width: "10%", minWidth: 80, px: 1 }} />
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file, idx) => (
              <TableRow key={idx} hover sx={{ bgcolor: "#fffaf3" }}>
                <TableCell padding="checkbox" sx={{ width: "10%", minWidth: 40, px: 1 }}>
                  <Checkbox 
                    checked={selectedFiles.has(idx)}
                    onChange={(e) => onSelectFile(idx, e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ width: "45%", minWidth: 100, overflow: "hidden", px: 1, pr: 0.25 }}>
                  <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                    {file.isFile ? (
                      <InsertDriveFileIcon sx={{ color: "#e17d5f", mr: 0.5, flexShrink: 0 }} />
                    ) : (
                      <FolderIcon sx={{ color: "#e17d5f", mr: 0.5, flexShrink: 0 }} />
                    )}
                    <Box sx={{ 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      whiteSpace: "nowrap",
                      minWidth: 0
                    }}>
                      {file.name}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: "35%", minWidth: 100, overflow: "hidden", px: 1, pl: 0.25 }}>
                  <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                    {isSharedFiles && isSharedFile(file) ? (
                      <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: "#ef4444",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            mr: 1,
                            flexShrink: 0
                          }}
                        >
                          {file.sharedBy.name.charAt(0).toUpperCase()}
                        </Box>
                        <Box sx={{ 
                          overflow: "hidden", 
                          textOverflow: "ellipsis", 
                          whiteSpace: "nowrap",
                          fontSize: "0.8rem",
                          minWidth: 0
                        }}>
                          {file.sharedBy.email}
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                        <Box sx={{ 
                          overflow: "hidden", 
                          textOverflow: "ellipsis", 
                          whiteSpace: "nowrap",
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                          minWidth: 0
                        }}>
                          {truncateCid(file.cid)}
                        </Box>
                        <IconButton
                          size="small"
                          sx={{ ml: 0.25, mr: 2.5, flexShrink: 0 }}
                          onClick={() => onCopyCid(file.cid)}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ width: "10%", minWidth: 80, px: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    {/*info card */}
                    <IconButton size="small" sx={{ color: "#666", p: 0.25 }} onClick={(e) => onOpenFileInfo(e, idx)}>
                      <Icon icon="material-symbols:info-outline-rounded" fontSize="20px" />
                    </IconButton>
                    {/* delete icon button  when isSharedFiles */}
                    {isSharedFiles && isSharedFile(file) ? (
                      <IconButton size="small" sx={{ color: "#666", p: 0.25 }} onClick={() => onDownloadFile(file.cid, file.name)}>
                        <FileDownloadIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={(e) => onOpenFileMenu(e, idx)} sx={{ p: 0.25 }}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // Desktop Table Layout (unchanged)
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, bgcolor: "secondary.main" }}
    >
              <Table>
          <TableHead sx={{ bgcolor: "#f4eade" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox 
                  checked={files.length > 0 && selectedFiles.size === files.length}
                  indeterminate={selectedFiles.size > 0 && selectedFiles.size < files.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </TableCell>
              {selectedFiles.size > 0 ? (
                <>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <strong>{selectedFiles.size} selected</strong>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Icon icon="mingcute:download-fill" />}
                        sx={{ 
                          bgcolor: "#ef4444", 
                          color: "white", 
                          fontSize: "0.8rem", 
                          px: 1.5, 
                          py: 0.5,
                          minWidth: "auto",
                          "&:hover": { bgcolor: "#dc2626" }
                        }}
                        onClick={onBulkDownload}
                      >
                        Download
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Icon icon="ic:round-delete" />}
                        sx={{ 
                          fontSize: "0.8rem", 
                          px: 1.5, 
                          py: 0.5,
                          minWidth: "auto",
                          bgcolor: "#FFFFFF",
                          borderColor: "#FFFFFF",
                          color: "#EB6464",
                          "&:hover": {
                            bgcolor: "#FFFFFF",
                            borderColor: "#FFFFFF",
                            color: "#EB6464",
                            boxShadow: "none"
                          },
                          "&:focus": {
                            boxShadow: "none"
                          },
                          "&:active": {
                            boxShadow: "none"
                          }
                        }}
                        onClick={onBulkDelete}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </>
              ) : (
                <>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{isSharedFiles ? "Shared by" : "CID"}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Size</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{isSharedFiles ? "Created" : "Uploaded"}</strong>
                  </TableCell>
                  <TableCell />
                </>
              )}
            </TableRow>
          </TableHead>
        <TableBody>
          {files.map((file, idx) => (
            <TableRow key={idx} hover sx={{ bgcolor: "secondary.main" }}>
              <TableCell padding="checkbox">
                <Checkbox 
                  checked={selectedFiles.has(idx)}
                  onChange={(e) => onSelectFile(idx, e.target.checked)}
                />
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
                {isSharedFiles && isSharedFile(file) ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: "#ef4444",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        mr: 1.5
                      }}
                    >
                      {file.sharedBy.name.charAt(0).toUpperCase()}
                    </Box>
                    <Box sx={{ 
                      fontSize: "0.875rem"
                    }}>
                      {file.sharedBy.email}
                    </Box>
                  </Box>
                ) : (
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
                )}
              </TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell>{file.date}</TableCell>
              <TableCell align="right">
                {/* delete icon button  when isSharedFiles */}
                {isSharedFiles && isSharedFile(file) ? (
                  <IconButton sx={{ color: "#e17d5f" }} onClick={() => onDownloadFile(file.cid, file.name)}>
                    <FileDownloadIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={(e) => onOpenFileMenu(e, idx)}>
                    <MoreVertIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FilesTable;