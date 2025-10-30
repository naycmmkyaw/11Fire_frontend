import React from "react";
import { Paper, Typography, Popover } from "@mui/material";

interface FileInfoProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    fileSize: string;
    uploadDate: string;
}

const FileInfo: React.FC<FileInfoProps> = ({ 
    anchorEl,
    onClose,
    fileSize, 
    uploadDate 
}) => {
    return (
        <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
            <Paper sx={{ p: 2, backgroundColor: "secondary.dark" }}>
                <Typography>
                <strong>Size:</strong> {fileSize}
                </Typography>
                <Typography>
                <strong>Created:</strong> {uploadDate}
                </Typography>
            </Paper>
        </Popover>
  );
};

export default FileInfo;