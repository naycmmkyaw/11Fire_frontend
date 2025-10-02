import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Box, Snackbar, CircularProgress } from "@mui/material";
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
import type { FileEntry, SharedFileEntry } from "../../types";
import { uploadFile, 
          deleteFile, 
          renameFile, 
          downloadFile, 
          downloadMultipleFiles, 
          deleteMultipleFiles,
          shareFile } from "../../services/filesService";
import { listMyGroups, type GroupMembership } from "../../services/getGroupList";
import { fetchFilesForGroup, fetchSharedFilesForGroup } from "../../services/getFiles";
import GroupDialog from "../../components/files/GroupDialog";
import Axios from "../../services/axiosInstance";
import LoadingDialog from "../../components/files/LoadingDialog";
import DeleteConfirmDialog from "../../components/files/DeleteConfirmDialog";
import ShareDialog from "../../components/files/ShareDialog";

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
  const [files, setFiles] = useState<(FileEntry | SharedFileEntry)[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
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
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<{ cid: string; name: string; isFile: boolean } | null>(null);
  const [shareEmails, setShareEmails] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
    const [isFilesLoading, setIsFilesLoading] = useState(false);
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
  const [isBulkDownloading, setIsBulkDownloading] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  // State for file sub-tabs (My files vs Shared with me)
  const [activeFileTab, setActiveFileTab] = useState<'my-files' | 'shared-with-me'>('my-files');

  // Check for navigation state on component mount
  useEffect(() => {
    const state = location.state as { swarmName?: string };
    if (state?.swarmName) {
      fetchGroups(state.swarmName);
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    } else {
      // Check localStorage for previously selected group
      const savedGroupId = localStorage.getItem('selectedGroupId');
      fetchGroups(undefined, savedGroupId);
    }
  }, []);

  // Handle tab switching
  useEffect(() => {
    if (!selectedGroup) {
      setFiles([]);
      setIsFilesLoading(false);
      return;
    }

    let cancelled = false;
    setFiles([]);
    setIsFilesLoading(true);

    const loadFiles = async () => {
      try {
        const data =
          activeFileTab === "shared-with-me"
            ? await fetchSharedFilesForGroup(selectedGroup.swarmId)
            : await fetchFilesForGroup(selectedGroup.swarmId);

        if (!cancelled) {
          setFiles(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load files:", error);
          setFiles([]);
        }
      } finally {
        if (!cancelled) {
          setIsFilesLoading(false);
        }
      }
    };

    loadFiles();

    return () => {
      cancelled = true;
    };
  }, [activeFileTab, selectedGroup]);

  const fetchGroups = async (swarmName?: string | undefined, savedGroupId?: string | null) => {
    try {
      setIsLoadingGroups(true);
      const groupsList = await listMyGroups();
      setGroups(groupsList);
      let groupToSelect: GroupMembership | undefined;
    
      // Priority order: swarmName > savedGroupId > first group
      if (swarmName) {
        groupToSelect = groupsList.find(g => g.swarmName === swarmName);
      } else if (savedGroupId) {
        groupToSelect = groupsList.find(g => g.swarmId === savedGroupId);
      }
      
      const resolvedGroup = groupToSelect ?? groupsList[0] ?? null;
      setSelectedGroup(resolvedGroup);

      if (resolvedGroup) {
        if (!savedGroupId || resolvedGroup.swarmId !== savedGroupId) {
          localStorage.setItem("selectedGroupId", resolvedGroup.swarmId);
        }
      } else {
        localStorage.removeItem("selectedGroupId");
        setFiles([]);
      }
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      setGroups([]);
      setSelectedGroup(null);
      setFiles([]);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const handleGroupSelect = (group: GroupMembership) => {
    setSelectedGroup(group);
    setFiles([]);
    setIsFilesLoading(true);
    localStorage.setItem("selectedGroupId", group.swarmId);
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
    setSnackbarMessage("Copied to clipboard");
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

  const handleBulkDownload = async () => {
    if (selectedFiles.size === 0) return;
    
    setIsBulkDownloading(true);
    
    try {
      const selectedCids = Array.from(selectedFiles).map(index => files[index].cid);
      await downloadMultipleFiles(selectedCids);
      setSelectedFiles(new Set()); // Clear selection after successful download
    } catch (error: any) {
      console.error('Bulk download failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to download files. Please try again.';
      setUploadError(errorMessage);
    } finally {
      setIsBulkDownloading(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedFiles.size === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedFiles.size === 0) return;
    
    setIsBulkDeleting(true);
    setBulkDeleteDialogOpen(false);
    
    try {
      const selectedCids = Array.from(selectedFiles).map(index => files[index].cid);
      const result = await deleteMultipleFiles(selectedCids);
      
      // Remove successfully deleted files from local state
      const successfulCids = new Set(result.results.successful.map((item: any) => item.cid));
      const updatedFiles = files.filter(file => !successfulCids.has(file.cid));
      setFiles(updatedFiles);
      
      // Clear selection
      setSelectedFiles(new Set());
      
      // Show success message if any files were deleted
      if (result.summary.successful > 0) {
        setSnackbarOpen(true);
      }
      
      // Show error message if some files failed
      if (result.summary.failed > 0 || result.summary.notOwned > 0) {
        const failedCount = result.summary.failed + result.summary.notOwned;
        setUploadError(`${failedCount} files could not be deleted. You may not own them or they may be in use.`);
      }
      
    } catch (error: any) {
      console.error('Bulk delete failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to delete files. Please try again.';
      setUploadError(errorMessage);
    } finally {
      setIsBulkDeleting(false);
    }
  };

   const handleShare = () => {
    if (activeFileTab !== "my-files") {
      setUploadError("Only your files can be shared.");
      setFileMenuAnchor(null);
      return;
    }
    if (activeFileIndex !== null) {
      const file = files[activeFileIndex];
      setShareTarget({
        cid: file.cid,
        name: file.name,
        isFile: "isFile" in file ? file.isFile : true,
      });
      setShareEmails("");
      setShareError(null);
      setShareDialogOpen(true);
      setFileMenuAnchor(null);
    }
  };

  const handleShareDialogClose = () => {
    if (isSharing) return;
    setShareDialogOpen(false);
    setShareTarget(null);
    setShareEmails("");
    setShareError(null);
    setActiveFileIndex(null);
  };

  const handleShareSubmit = async () => {
    if (!shareTarget) return;

    const emails = Array.from(
      new Set(
        shareEmails
          .split(/[\s,;]+/)
          .map((email) => email.trim())
          .filter(Boolean)
      )
    );

    if (emails.length === 0) {
      setShareError("Enter at least one email.");
      return;
    }

    setIsSharing(true);
    setShareError(null);

    try {
      const response = await shareFile(shareTarget.cid, emails);

      const matchedCount = response.sharedWith?.length ?? 0;
      const unresolved = response.unresolvedEmails ?? [];

      if (matchedCount > 0) {
        const countLabel = matchedCount === 1 ? "user" : "users";
        setSnackbarMessage(
          `Shared "${shareTarget.name}" with ${matchedCount} ${countLabel}.`
        );
        setSnackbarOpen(true);
      } else if (unresolved.length === 0) {
        setSnackbarMessage("No matching recipients were found.");
        setSnackbarOpen(true);
      }

      if (unresolved.length > 0) {
        setShareError(`Could not share with: ${unresolved.join(", ")}`);
      } else {
        setShareDialogOpen(false);
        setShareTarget(null);
        setShareEmails("");
        setActiveFileIndex(null);
      }
    } catch (error: any) {
      console.error("Share failed:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to share file. Please try again.";
      setShareError(errorMessage);
    } finally {
      setIsSharing(false);
    }
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

      <FileTabs 
        isMobile={isMobile} 
        activeTab={activeFileTab}
        onTabChange={setActiveFileTab}
      />

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
          {activeFileTab === 'my-files' && <AddButton onClick={handleAddClick} />}
        </Box>
      </Box>

      {isFilesLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : files.length === 0 ? (
        <EmptyFilesCard isMobile={isMobile} activeTab={activeFileTab} />
      ) : (
        <FilesTable
          files={files}
          onCopyCid={handleCopyCid}
          onOpenFileMenu={handleFileMenuOpen}
          isMobile={isMobile}
          selectedFiles={selectedFiles}
          onSelectAll={handleSelectAll}
          onSelectFile={handleSelectFile}
          onBulkDownload={handleBulkDownload}
          onBulkDelete={handleBulkDelete}
          isSharedFiles={activeFileTab === 'shared-with-me'}
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
        onShare={handleShare}
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
      <ShareDialog
        open={shareDialogOpen}
        onClose={handleShareDialogClose}
        fileName={shareEmails}
        setFileName={setShareEmails}
        isFileShare={shareTarget?.isFile ?? true}
        onSubmit={handleShareSubmit}
        isSharing={isSharing}
        shareError={shareError}
        targetName={shareTarget?.name ?? ""}
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
      {/* Delete Loading Dialog */}
      <LoadingDialog
        open={isDeleting}
        onClose={() => {}}
        title="Deleting File"
        loadingText="Deleting file, please wait..."
      />
      {/* Download Loading Dialog */}
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

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        onConfirm={handleBulkDeleteConfirm}
        fileName={`${selectedFiles.size} selected files`}
      />

      {/* Bulk Download Loading Dialog */}
      <LoadingDialog
        open={isBulkDownloading}
        onClose={() => {}}
        title="Downloading Files"
        loadingText={`Downloading ${selectedFiles.size} files...`}
      />

      {/* Bulk Delete Loading Dialog */}
      <LoadingDialog
        open={isBulkDeleting}
        onClose={() => {}}
        title="Deleting Files"
        loadingText={`Deleting ${selectedFiles.size} files...`}
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