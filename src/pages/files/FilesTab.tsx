import React, { useState, useEffect } from "react";
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
import { uploadFile } from "../../services/filesService";
import { listMyGroups, type GroupMembership } from "../../services/getGroupList";
import { fetchFilesForGroup } from "../../services/getFiles";
import GroupDialog from "../../components/files/GroupDialog";
import Axios from "../../services/axiosInstance";
import LoadingDialog from "../../components/files/LoadingDialog";

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
  const [uploadError, setUploadError] = useState<string | null>(null);
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

    // Fetch groups on component mount
  useEffect(() => {
    fetchGroups();
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
      const updatedFiles = [...files];
      updatedFiles[activeFileIndex] = {
        ...updatedFiles[activeFileIndex],
        name: fileName,
      };
      setFiles(updatedFiles);
      setDialogOpen(false);
      setIsRenameMode(false);
      setActiveFileIndex(null);
      setSelectedFile(null);
      return;
    }

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
    if (isUploading) return; // Prevent closing during upload
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
        isUploading={isUploading}
        uploadError={uploadError}
      />
      <LoadingDialog
        open={isUploading}
        onClose={() => {}} // Prevent closing during upload
        title="Uploading File"
        loadingText={`Uploading "${fileName}" to the group...`}
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