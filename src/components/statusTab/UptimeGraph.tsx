import React from 'react';
import { Paper,Box, Typography } from '@mui/material';

interface UptimeGraphProps {
  uptime: number; // percentage (0-100)
  downtime: { hours: number; minutes: number };
  data?: Array<{ timestamp: number; value: number }>; // optional historical data
}

const UptimeGraph: React.FC<UptimeGraphProps> = ({ 
  uptime, 
  downtime, 
  data = [] 
}) => {
  // Generate sample data if none provided
  const graphData = data.length > 0 ? data : generateSampleData();
  
  // Generate sample uptime data for demonstration
  function generateSampleData() {
    const points = 24; // 24 data points
    const data = [];
    for (let i = 0; i < points; i++) {
      const baseValue = 85 + Math.random() * 15; // Random between 85-100%
      const noise = (Math.random() - 0.5) * 10; // Add some noise
      data.push({
        timestamp: i,
        value: Math.max(0, Math.min(100, baseValue + noise))
      });
    }
    return data;
  }

  const values = graphData.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;

  // SVG dimensions
  const width = 700; 
  const height = 150; 
  const padding = 20;

  // Generate SVG path for the line graph
  const generatePath = () => {
    if (graphData.length === 0) return '';
    
    const xStep = (width - 2 * padding) / (graphData.length - 1);
    const yScale = (height - 2 * padding) / range;
    
    let path = `M ${padding} ${height - padding - (graphData[0].value - minValue) * yScale}`;
    
    for (let i = 1; i < graphData.length; i++) {
      const x = padding + i * xStep;
      const y = height - padding - (graphData[i].value - minValue) * yScale;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  // Generate area fill path
  const generateAreaPath = () => {
    if (graphData.length === 0) return '';
    
    const xStep = (width - 2 * padding) / (graphData.length - 1);
    const yScale = (height - 2 * padding) / range;
    
    let path = `M ${padding} ${height - padding}`;
    
    // Go forward through the data
    for (let i = 0; i < graphData.length; i++) {
      const x = padding + i * xStep;
      const y = height - padding - (graphData[i].value - minValue) * yScale;
      path += ` L ${x} ${y}`;
    }
    
    // Go back to the bottom
    for (let i = graphData.length - 1; i >= 0; i--) {
      const x = padding + i * xStep;
      path += ` L ${x} ${height - padding}`;
    }
    
    path += ' Z';
    return path;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "secondary.main",
        border: "1px solid #e5e7eb",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Title */}
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, 
          color: "#000000", 
          mb: 2,
          fontSize: '1.125rem'
        }}
      >
        Node Uptime
      </Typography>
      
      {/* Separator line */}
      <Box 
        sx={{ 
          height: '1px', 
          bgcolor: '#E5E7EB', 
          mb: 2,
          width: '100%'
        }} 
      />
      
      {/* Metrics */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            color: "#000000", 
            mb: 1,
            fontSize: '0.875rem'
          }}
        >
          Uptime: <span style={{ fontWeight: 600 }}>{uptime.toFixed(1)}%</span>
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: "#000000",
            fontSize: '0.875rem'
          }}
        >
          Downtime: <span style={{ fontWeight: 600 }}>{downtime.hours}h {downtime.minutes}m</span>
        </Typography>
      </Box>
      
      {/* Graph */}
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <svg width="100%" height={height} style={{ height: 'auto', maxHeight: '150px' }} viewBox={`0 0 ${width} ${height}`}>
          {/* Area fill */}
          <path
            d={generateAreaPath()}
            fill="#E8F5E8"
            opacity={0.6}
          />
          
          {/* Line */}
          <path
            d={generatePath()}
            stroke="#4CAF50"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {graphData.map((point, index) => {
            const x = padding + (index * (width - 2 * padding)) / (graphData.length - 1);
            const y = height - padding - ((point.value - minValue) * (height - 2 * padding)) / range;
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={2}
                fill="#4CAF50"
              />
            );
          })}
        </svg>
      </Box>
    </Paper>
  );
};

export default UptimeGraph;
