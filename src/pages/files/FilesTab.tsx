import React, { useState, useEffect } from "react";
import { Box, Snackbar } from "@mui/material";
import EmptyFilesCard from "../../components/files/EmptyFilesCard";
import FilesTable from "../../components/files/FilesTable";
import ResponsiveHeader from "../../components/shared/ResponsiveHeader";
import FileTabs from "../../components/files/FileTabs";
import SearchBar from "../../components/files/SearchBar";
import GroupDropdown from "../../components/files/GroupDropdown";
import AddButton from "../../components/files/AddButton";
import UploadMenu from "../../components/files/UploadMenu";
import FileActionsMenu from "../../components/files/FileActionsMenu";
import UploadDialog from "../../components/files/UploadDialog";
import useIsMobile from "../../hooks/useMobile";
import type { FileEntry } from "../../types";
// import { uploadFileToIPFS } from "../api/upload";
// import { useEffect } from "react";
// import { fetchFiles } from "../api/files";
// import { downloadFile } from "../api/download";
// import { deleteFile } from "../api/delete";

interface FilesTabContentProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  isProviderDashboard: boolean;
  onTabChange?: (tab: string) => void;
}

// Utility functions
const formatSize = (size: number): string => {
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
};

const truncateCid = (cid: string): string => 
  `${cid.slice(0, 6)}...${cid.slice(-4)}`;

// Main component
const FilesTabContent: React.FC<FilesTabContentProps> = ({
  selectedTab,
  setSelectedTab,
  isProviderDashboard,
  onTabChange
}) => {
  const isMobile = useIsMobile();
  
  // State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [isFileUpload, setIsFileUpload] = useState(true);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [fileMenuAnchor, setFileMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
  const [isRenameMode, setIsRenameMode] = useState(false);
  const [groupMenuAnchor, setGroupMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());

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

  // Ensure activeFileIndex is valid after files array changes
  useEffect(() => {
    if (activeFileIndex !== null && activeFileIndex >= files.length) {
      setActiveFileIndex(null);
      setFileMenuAnchor(null);
    }
  }, [files, activeFileIndex]);

  // Close menu if activeFileIndex becomes invalid
  useEffect(() => {
    if (activeFileIndex === null && fileMenuAnchor !== null) {
      setFileMenuAnchor(null);
    }
  }, [activeFileIndex, fileMenuAnchor]);

  // Clear invalid selections when files array changes
  useEffect(() => {
    const validIndices = new Set<number>();
    for (let i = 0; i < files.length; i++) {
      if (selectedFiles.has(i)) {
        validIndices.add(i);
      }
    }
    if (validIndices.size !== selectedFiles.size) {
      setSelectedFiles(validIndices);
    }
  }, [files, selectedFiles]);

  // Event handlers
  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIndices = new Set<number>();
      for (let i = 0; i < files.length; i++) {
        allIndices.add(i);
      }
      setSelectedFiles(allIndices);
    } else {
      setSelectedFiles(new Set());
    }
  };

  const handleSelectFile = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedFiles);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedFiles(newSelected);
  };

  const handleClose = () => setAnchorEl(null);

  const handleFileUploadClick = () => {
    setAnchorEl(null);
    setIsFileUpload(true);
    setIsRenameMode(false);
    setSelectedFile(null); // Clear any previous selectedFile
    setActiveFileIndex(null); // Clear any previous activeFileIndex
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
    setSelectedFile(null); // Clear any previous selectedFile
    setActiveFileIndex(null); // Clear any previous activeFileIndex
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
    } else if (selectedFile && !isRenameMode) {
      try {
        // const cid = await uploadFileToIPFS(selectedFile);
        // For now, create a mock CID since the function is commented out
        const cid = "mock_cid_" + Date.now();
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
    setSelectedFile(null);
  };

  const handleCopyCid = (cid: string) => {
    navigator.clipboard.writeText(cid);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleGroupButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setGroupMenuAnchor(event.currentTarget);
  };

  const handleFileMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setFileMenuAnchor(event.currentTarget);
    setActiveFileIndex(index);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchor(null);
    setActiveFileIndex(null);
  };

  const handleRename = () => {
    if (activeFileIndex !== null) {
      setIsRenameMode(true);
      setSelectedFile(null); // Clear selectedFile when entering rename mode
      setFileName(files[activeFileIndex].name);
      setDialogOpen(true);
      // Close the menu but preserve activeFileIndex for the rename operation
      setFileMenuAnchor(null);
      // Don't call handleFileMenuClose() here as it would reset activeFileIndex
    } else {
      handleFileMenuClose();
    }
  };

  const handleDownload = () => {
    if (activeFileIndex !== null) {
      const file = files[activeFileIndex];
      // downloadFile(file.cid, file.name);
      // For now, just log the download action since the function is commented out
      console.log("Download file:", file.name, file.cid);
      
      // Close the dropdown menu after download action
      setFileMenuAnchor(null);
      setActiveFileIndex(null);
    }
  };

  const handleDelete = () => {
    if (activeFileIndex !== null) {
      // deleteFile(files[activeFileIndex].cid)
      //   .then(() => {
      //     const updated = [...files];
      //     updated.splice(activeFileIndex, 1);
      //     setFiles(updated);
      //   })
      //   .catch((err) => alert("Failed to delete file"));
      // For now, just remove from local state since the function is commented out
      const updated = [...files];
      updated.splice(activeFileIndex, 1);
      setFiles(updated);
      
      // Close the dropdown menu after deletion
      setFileMenuAnchor(null);
      setActiveFileIndex(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setIsRenameMode(false);
    setActiveFileIndex(null);
    setSelectedFile(null);
    setFileName("");
    setFileSize("");
  };

  return (
    <Box>
      <ResponsiveHeader 
        title={isMobile ? "Files" : "FILES"} 
        avatarText="N" 
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isProviderDashboard={isProviderDashboard}
        onTabChange={onTabChange}
      />

      <FileTabs isMobile={isMobile} />

      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile && (
            <GroupDropdown
              anchorEl={groupMenuAnchor}
              onOpen={handleGroupButtonClick}
              onClose={() => setGroupMenuAnchor(null)}
              isMobile={isMobile}
            />
          )}
          {!isMobile && <SearchBar />}
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {!isMobile && (
            <GroupDropdown
              anchorEl={groupMenuAnchor}
              onOpen={handleGroupButtonClick}
              onClose={() => setGroupMenuAnchor(null)}
              isMobile={isMobile}
            />
          )}
          <AddButton onClick={handleAddClick} />
        </Box>
      </Box>

      {files.length === 0 ? (
        <EmptyFilesCard isMobile={isMobile} />
      ) : (
        <FilesTable
          files={files}
          onCopyCid={handleCopyCid}
          onOpenFileMenu={handleFileMenuOpen}
          isMobile={isMobile}
          selectedFiles={selectedFiles}
          onSelectAll={handleSelectAll}
          onSelectFile={handleSelectFile}
        />
      )}

      {/* Menus and Dialogs */}
      <UploadMenu
        anchorEl={anchorEl}
        onClose={handleClose}
        onFileUpload={handleFileUploadClick}
        onFolderUpload={handleFolderUploadClick}
      />

      <FileActionsMenu
        anchorEl={fileMenuAnchor}
        onClose={handleFileMenuClose}
        onRename={handleRename}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      <UploadDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fileName={fileName}
        setFileName={setFileName}
        isRenameMode={isRenameMode}
        isFileUpload={isFileUpload}
        onSubmit={handleUpload}
      />

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