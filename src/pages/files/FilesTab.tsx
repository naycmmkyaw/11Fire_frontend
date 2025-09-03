import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Box, Snackbar } from "@mui/material";
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
import { uploadFile, deleteFile, renameFile, downloadFile } from "../../services/filesService";
import { listMyGroups, type GroupMembership } from "../../services/getGroupList";
import { fetchFilesForGroup } from "../../services/getFiles";
import GroupDialog from "../../components/files/GroupDialog";
import Axios from "../../services/axiosInstance";
import LoadingDialog from "../../components/files/LoadingDialog";
import DeleteConfirmDialog from "../../components/files/DeleteConfirmDialog";

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

// Main component
const FilesTabContent: React.FC<FilesTabContentProps> = ({
  selectedTab,
  setSelectedTab,
  isProviderDashboard,
  onTabChange
}) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
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
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{ index: number; name: string } | null>(null);
  // New state for groups
  const [groups, setGroups] = useState<GroupMembership[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupMembership | null>(null);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [isJoinMode, setIsJoinMode] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [radioValue, setRadioValue] = useState("");
  const [groupDialogError, setGroupDialogError] = useState<string | null>(null);

  // Check for navigation state on component mount
  useEffect(() => {
    const state = location.state as { swarmName?: string };
    if (state?.swarmName) {
      fetchGroups(state.swarmName);
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    } else {
      fetchGroups();
    }
  }, []);

  const fetchGroups = async (swarmName?: string | undefined) => {
    try {
      setIsLoadingGroups(true);
      const groupsList = await listMyGroups();
      setGroups(groupsList);
      // If activeSwarm is provided, set that group as selected
      if (swarmName) {
        const activeGroup = groupsList.find(g => g.swarmName === swarmName);
        setSelectedGroup(activeGroup || groupsList[0]);
        if (activeGroup) {
          const groupFiles = await fetchFilesForGroup(activeGroup.swarmId);
          setFiles(groupFiles);
        }
      } else {
        setSelectedGroup(groupsList[0]);
        // Optionally fetch files for the first group
        if (groupsList[0]) {
          const groupFiles = await fetchFilesForGroup(groupsList[0].swarmId);
          setFiles(groupFiles);
        }
      }
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      // Could show a snackbar error here
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleGroupSelect = async (group: GroupMembership) => {
    setSelectedGroup(group);
    console.log('Selected group:', group);
    try {
      const groupFiles = await fetchFilesForGroup(group.swarmId);
      setFiles(groupFiles);
    } catch (error) {
      console.error('Failed to fetch files for selected group:', error);
      setFiles([]); // Optionally clear files on error
    }
  };

  const handleOpenGroupDialog = (joinMode: boolean) => {
    setIsJoinMode(joinMode);
    setGroupDialogOpen(true);
    setGroupName("");
  };

  const handleCloseGroupDialog = () => {
    setGroupDialogOpen(false);
    setGroupName("");
  };

  const handleGroupDialogSubmit = async () => {
  setGroupDialogError(null);
  if (!groupName.trim() || !passcode || !radioValue) {
    setGroupDialogError("All fields are required.");
    return;
  }
  if (!["user", "provider"].includes(radioValue)) {
    setGroupDialogError("Choose a valid role.");
    return;
  }
  if (!isJoinMode && passcode.length < 8) {
    setGroupDialogError("Password must be at least 8 characters.");
    return;
  }

  try {
    let swarmName: string | undefined;
    if (isJoinMode) {
      const res = await Axios.post("/swarms/join", {
        name: groupName.trim(),
        password: passcode,
        role: radioValue,
      });
      swarmName = res.data?.name;
    } else {
      const res =await Axios.post("/swarms/create", {
        name: groupName.trim(),
        password: passcode,
        role: radioValue,
      });
      swarmName = res.data?.name;
    }
    
    // Refresh group list after successful create/join
    await fetchGroups(swarmName);
    setGroupDialogOpen(false);
    setGroupName("");
    setPasscode("");
    setRadioValue("");
  } catch (error: any) {
    setGroupDialogError(
      error.response?.data?.error || "Failed to process group action"
    );
  }
};

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
      const file = files[activeFileIndex];
      setIsRenaming(true);
      setDialogOpen(false); // Close the rename dialog when starting rename  
      try {
        const response = await renameFile(file.cid, fileName);
        
        // Update the file in local state after successful rename
        const updatedFiles = [...files];
        updatedFiles[activeFileIndex] = {
          ...updatedFiles[activeFileIndex],
          name: response.name, // Use the cleaned name from backend
        };
        setFiles(updatedFiles);
        
        setSnackbarOpen(true); // Show success message
      } catch (error: any) {
        console.error('Rename failed:', error);
        const errorMessage = error.response?.data?.error || 'Failed to rename file. Please try again.';
        setUploadError(errorMessage);
      } finally {
        setIsRenaming(false);
        setIsRenameMode(false);
        setActiveFileIndex(null);
        setSelectedFile(null);
        setFileName("");
        setFileSize("");
      }
      return;
    }
    // Regular upload logic
    if (!selectedFile || isRenameMode) return;

    setIsUploading(true);
    setUploadError(null);
    setDialogOpen(false); // Close the upload dialog when starting upload

    try {
      const response = await uploadFile(selectedFile);
      // Check for duplicate by CID
      const isDuplicate = files.some(file => file.cid === response.cid);
      if (isDuplicate) {
        setUploadError("This file already exists in the group.");
        return;
      }
      
      const newFile: FileEntry = {
        name: fileName,
        cid: response.cid,
        size: fileSize,
        date: new Date().toLocaleDateString(),
        isFile: isFileUpload,
      };
      
      setFiles([...files, newFile]);
    } catch (error: any) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.error || 'Upload failed. Please try again.';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setActiveFileIndex(null);
      setFileName("");
      setFileSize("");
    }
  };

  const handleCopyCid = (cid: string) => {
    navigator.clipboard.writeText(cid);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setUploadError(null);
  };

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

  const handleRename = async () => {
    if (activeFileIndex !== null) {
      const file = files[activeFileIndex];
      setFileName(file.name); // Pre-populate with current file name
      setIsRenameMode(true);
      setDialogOpen(true);
      setFileMenuAnchor(null); // Close the menu
    }
  };

  const handleDownload = async () => {
    if (activeFileIndex !== null) {
      const file = files[activeFileIndex];
      setIsDownloading(true);
      setFileMenuAnchor(null); // Close menu immediately
      
      try {
        await downloadFile(file.cid, file.name);
        // Download success is handled by the browser
      } catch (error: any) {
        console.error('Download failed:', error);
        const errorMessage = error.response?.data?.error || 'Failed to download file. Please try again.';
        setUploadError(errorMessage);
      } finally {
        setIsDownloading(false);
        setActiveFileIndex(null);
      }
    }
  };

  const handleDelete = () => {
    if (activeFileIndex !== null) {
      const file = files[activeFileIndex];
      setFileToDelete({ index: activeFileIndex, name: file.name });
      setDeleteDialogOpen(true);
      setFileMenuAnchor(null); // Close menu immediately
    }
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    
    const file = files[fileToDelete.index];
    setIsDeleting(true);
    setDeleteDialogOpen(false); // Close confirmation dialog
    
    try {
      await deleteFile(file.cid);
      
      // Remove from local state after successful deletion
      const updated = [...files];
      updated.splice(fileToDelete.index, 1);
      setFiles(updated);
    } catch (error: any) {
      console.error('Delete failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete file. Please try again.';
      setUploadError(errorMessage);
    } finally {
      setIsDeleting(false);
      setActiveFileIndex(null);
      setFileToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setFileToDelete(null);
    setActiveFileIndex(null);
  };

  const handleDialogClose = () => {
    if (isUploading || isRenaming) return; // Prevent closing during upload
    setDialogOpen(false);
    setIsRenameMode(false);
    setActiveFileIndex(null);
    setSelectedFile(null);
    setFileName("");
    setFileSize("");
    setUploadError(null);
  };

  return (
    <Box>
      <ResponsiveHeader 
        title={isMobile ? "Files" : "FILES"} 
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
              groups={groups}
              selectedGroup={selectedGroup}
              onGroupSelect={handleGroupSelect}
              onCreateGroup={() => handleOpenGroupDialog(false)}
              onJoinGroup={() => handleOpenGroupDialog(true)}
              isLoading={isLoadingGroups}
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
              groups={groups}
              selectedGroup={selectedGroup}
              onGroupSelect={handleGroupSelect}
              onCreateGroup={() => handleOpenGroupDialog(false)}
              onJoinGroup={() => handleOpenGroupDialog(true)}
              isLoading={isLoadingGroups}
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
        isUploading={isUploading || isRenaming}
        uploadError={uploadError}
      />
      {/* Upload Loading Dialog */}
      <LoadingDialog
        open={isUploading}
        onClose={() => {}} // Prevent closing during upload
        title="Uploading File"
        loadingText={`Uploading "${fileName}" to the group...`}
      />
      {/* Rename Loading Dialog */}
      <LoadingDialog
        open={isRenaming}
        onClose={() => {}}
        title="Renaming File"
        loadingText={`Renaming file to "${fileName}"...`}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        fileName={fileToDelete?.name || ""}
      />

      <LoadingDialog
        open={isDeleting}
        onClose={() => {}}
        title="Deleting File"
        loadingText="Deleting file, please wait..."
      />

      <LoadingDialog
        open={isDownloading}
        onClose={() => {}}
        title="Downloading File"
        loadingText={`Downloading file, please wait...`}
      />
      <GroupDialog
      open={groupDialogOpen}
      onClose={handleCloseGroupDialog}
      groupName={groupName}
      setGroupName={setGroupName}
      passcode={passcode}
      setPasscode={setPasscode}
      radioValue={radioValue}
      setRadioValue={setRadioValue}
      isJoinMode={isJoinMode}
      onSubmit={handleGroupDialogSubmit}
      groupDialogError={groupDialogError}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      <Snackbar
        open={!!uploadError}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {uploadError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FilesTabContent;