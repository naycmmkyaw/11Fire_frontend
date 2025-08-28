import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface CodeBlockProps {
  code: string;
  language: string;
  onCopy?: (code: string) => void;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, onCopy }) => {
  const handleCopy = () => {
    if (onCopy) {
      onCopy(code);
    } else {
      navigator.clipboard.writeText(code);
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        bgcolor: '#1e293b', 
        color: '#e2e8f0', 
        p: 2, 
        borderRadius: 1,
        position: 'relative',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        overflow: 'auto',
        mb: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          {language}
        </Typography>
        <IconButton 
          size="small" 
          onClick={handleCopy}
          sx={{ color: '#94a3b8', '&:hover': { color: '#e2e8f0' } }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {code}
      </Box>
    </Paper>
  );
};

export default CodeBlock;
