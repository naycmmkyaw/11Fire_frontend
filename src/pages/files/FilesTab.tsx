import React, { useState } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Paper,
  Snackbar,
  Divider,  
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import EmptyFilesCard from "../../components/files/EmptyFilesCard";
import FilesTable from "../../components/files/FilesTable";
import PageHeader from "../../components/shared/PageHeader";
// import { uploadFileToIPFS } from "../api/upload";
// import { useEffect } from "react";
// import { fetchFiles } from "../api/files";
// import { downloadFile } from "../api/download";
// import { deleteFile } from "../api/delete";

interface FileEntry {
  name: string;
  cid: string;
  size: string;
  date: string;
  isFile: boolean;
}

const formatSize = (size: number) => {
  if (size >= 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + " MB";
  if (size >= 1024) return (size / 1024).toFixed(1) + " KB";
  return size + " B";
};

const truncateCid = (cid: string) => cid.slice(0, 6) + "..." + cid.slice(-4);

const FilesTabContent = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [isFileUpload, setIsFileUpload] = useState(true);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [fileMenuAnchor, setFileMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
  const [isRenameMode, setIsRenameMode] = useState(false);
  const [groupMenuAnchor, setGroupMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  // useEffect(() => {
  //   fetchFiles().then((data) => {
  //     const formatted = data.map((f: any) => ({
  //       name: f.name,
  //       cid: f.cid,
  //       size: formatSize(f.size),
  //       date: new Date(f.date).toLocaleDateString(),
  //       isFile: f.isFile,
  //     }));
  //     setFiles(formatted);
  //   });
  // }, []);

  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleFileUploadClick = () => {
    setAnchorEl(null);
    setIsFileUpload(true);
    setIsRenameMode(false);
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setSelectedFile(file);
        setFileName(file.name);
        setFileSize(formatSize(file.size));
        setDialogOpen(true);
      }
    };
    input.click();
  };

  const handleFolderUploadClick = () => {
    setAnchorEl(null);
    setIsFileUpload(false);
    setIsRenameMode(false);
    const input = document.createElement("input");
    input.type = "file";
    input.webkitdirectory = true;
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const filesList = target.files;
      if (filesList && filesList.length > 0) {
        const totalSize = Array.from(filesList).reduce(
          (acc, file) => acc + file.size,
          0
        );
        setSelectedFile(null);
        setFileName(filesList[0].webkitRelativePath.split("/")[0]);
        setFileSize(formatSize(totalSize));
        setDialogOpen(true);
      }
    };
    input.click();
  };

  const handleUpload = async () => {
    if (isRenameMode && activeFileIndex !== null) {
      const updatedFiles = [...files];
      updatedFiles[activeFileIndex] = {
        ...updatedFiles[activeFileIndex],
        name: fileName,
      };
      setFiles(updatedFiles);
    } else if (selectedFile) {
      try {
        const cid = await uploadFileToIPFS(selectedFile);
        const newFile: FileEntry = {
          name: fileName,
          cid,
          size: fileSize,
          date: new Date().toLocaleDateString(),
          isFile: isFileUpload,
        };
        setFiles([...files, newFile]);
      } catch (err) {
        alert("Upload failed.");
        console.error(err);
      }
    }

    setDialogOpen(false);
    setIsRenameMode(false);
    setActiveFileIndex(null);
  };

  const handleCopyCid = (cid: string) => {
    navigator.clipboard.writeText(cid);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleGroupButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setGroupMenuAnchor(event.currentTarget);
  };
  return (
    <Box>
      <PageHeader title="FILES" avatarText="N" />

      <Tabs
        value={0}
        textColor="inherit"
        indicatorColor="primary"
        sx={{ mb: 2 }}
      >
        <Tab
          label={
            <Typography
              sx={{
                fontWeight: 500,
                color: "#ef4444",
                textTransform: "none",
                fontSize: "1.2rem",
              }}
            >
              My files
            </Typography>
          }
        />
        <Tab
          label={
            <Typography
              sx={{
                fontWeight: 500,
                color: "#000",
                textTransform: "none",
                fontSize: "1.2rem",
              }}
            >
              Shared with me
            </Typography>
          }
        />
      </Tabs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#f1e9dd",
            borderRadius: 2,
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            onClick={handleGroupButtonClick}
            sx={{
              borderRadius: 2,
              bgcolor: "#fff7ed",
              border: "1px solid #b5b5b5",
              px: 3,
              height: 36,
              fontWeight: 500,
              fontSize: "1rem",
              color: "#333",
              textTransform: "none",
            }}
          >
            Nay Che’s group
          </Button>
          <Menu
            anchorEl={groupMenuAnchor}
            open={Boolean(groupMenuAnchor)}
            onClose={() => setGroupMenuAnchor(null)}
            PaperProps={{
              sx: {
                bgcolor: "#fff5e9",
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
              Nay Che’s group
            </Typography>
            <Typography sx={{ px: 1.5, pb: 1, color: "#333" }}>
              Su Lei’s group
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              bgcolor: "#ef4444",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              height: 36,
            }}
          >
            Add
          </Button>
        </Box>
      </Box>

      {files.length === 0 ? (
        <EmptyFilesCard />
      ) : (
        <FilesTable
          files={files}
          onCopyCid={handleCopyCid}
          onOpenFileMenu={(e, idx) => {
            setFileMenuAnchor(e.currentTarget);
            setActiveFileIndex(idx);
          }}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
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
        <MenuItem
          onClick={handleFileUploadClick}
          sx={{ borderRadius: "12px", "&:hover": { bgcolor: "#f3ede1" } }}
        >
          <ListItemIcon>
            <DescriptionIcon fontSize="small" sx={{ color: "#e17d5f" }} />
          </ListItemIcon>
          <ListItemText primary="Upload File" />
        </MenuItem>
        <MenuItem
          onClick={handleFolderUploadClick}
          sx={{ borderRadius: "12px", "&:hover": { bgcolor: "#f3ede1" } }}
        >
          <ListItemIcon>
            <FolderIcon fontSize="small" sx={{ color: "#e17d5f" }} />
          </ListItemIcon>
          <ListItemText primary="Upload Folder" />
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={fileMenuAnchor}
        open={Boolean(fileMenuAnchor)}
        onClose={() => {
          setFileMenuAnchor(null);
          setActiveFileIndex(null);
        }}
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
        <MenuItem
          onClick={() => {
            if (activeFileIndex !== null) {
              setIsRenameMode(true);
              setFileName(files[activeFileIndex].name);
              setDialogOpen(true);
            }
            setFileMenuAnchor(null);
          }}
          sx={{ borderRadius: "12px", "&:hover": { bgcolor: "#f3ede1" } }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ color: "#e17d5f" }} />
          </ListItemIcon>
          <ListItemText primary="Rename" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (activeFileIndex !== null) {
              const file = files[activeFileIndex];
              downloadFile(file.cid, file.name);
            }
          }}
          sx={{ borderRadius: "12px", "&:hover": { bgcolor: "#f3ede1" } }}
        >
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" sx={{ color: "#e17d5f" }} />
          </ListItemIcon>
          <ListItemText primary="Download" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (activeFileIndex !== null) {
              const file = files[activeFileIndex];
              deleteFile(file.cid)
                .then(() => {
                  const updated = [...files];
                  updated.splice(activeFileIndex, 1);
                  setFiles(updated);
                })
                .catch((err) => alert("Failed to delete file"));
            }
          }}
          sx={{ borderRadius: "12px", "&:hover": { bgcolor: "#f3ede1" } }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: "#e17d5f" }} />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setIsRenameMode(false);
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            px: 4,
            pt: 3,
            pb: 2,
            bgcolor: "#fff7ed",
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.4rem", mb: 1 }}>
          {isRenameMode
            ? "Rename"
            : isFileUpload
            ? "File Upload"
            : "Folder Upload"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1, fontSize: "1rem" }}>
            Confirm file name
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            label="Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            sx={{ bgcolor: "#fff7ed", borderRadius: 2 }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            pt: 1,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setDialogOpen(false);
              setIsRenameMode(false);
            }}
            sx={{ borderRadius: 2, color: "#3c3c3c", borderColor: "#ccc" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            sx={{
              borderRadius: 2,
              bgcolor: "color.primary",
              color: "#000",
              "&:hover": { bgcolor: "#f8a07a" },
            }}
          >
            {isRenameMode ? "Rename" : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Copied to Clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default FilesTabContent;