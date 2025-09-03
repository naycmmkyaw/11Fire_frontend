import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import { providerNodeService } from '../../services/providerNodeService';
import type { UptimeLineData } from '../../types';

interface UptimeGraphProps {
  uptime?: number; // percentage (0-100) - now optional since we fetch from backend
  downtime?: { hours: number; minutes: number }; // now optional since we fetch from backend
  data?: Array<{ timestamp: number; status: 'up' | 'down' }>; // status data over time
}

const UptimeGraph: React.FC<UptimeGraphProps> = ({ 
  uptime: propUptime, 
  downtime: propDowntime, 
  data: propData = [] 
}) => {
  const [currentHour, setCurrentHour] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Backend data state
  const [uptimeLineData, setUptimeLineData] = useState<UptimeLineData | null>(null);
  const [uptime, setUptime] = useState(98.2);
  const [downtime, setDowntime] = useState({ hours: 1, minutes: 24 });

  // Fetch uptime data from backend
  const fetchUptimeData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch both uptime summary and 24h line data
      const [uptimeResponse, lineDataResponse] = await Promise.all([
        providerNodeService.getActiveUptime(),
        providerNodeService.getActiveUptimeLine24h()
      ]);
      
      setUptimeLineData(lineDataResponse);
      
      // Update local state with backend data
      if (uptimeResponse.ok) {
        setUptime(uptimeResponse.uptimePercent);
        
        // Parse downtime string from backend (e.g., "1h 24m")
        const downtimeStr = uptimeResponse.downtime;
        const hoursMatch = downtimeStr.match(/(\d+)h/);
        const minutesMatch = downtimeStr.match(/(\d+)m/);
        const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
        setDowntime({ hours, minutes });
      }
      
    } catch (err) {
      console.error('Error fetching uptime data:', err);
      setError('Failed to fetch uptime data');
      // Fall back to props if available
      if (propUptime !== undefined) setUptime(propUptime);
      if (propDowntime !== undefined) setDowntime(propDowntime);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert backend line data to graph format
  const convertBackendDataToGraphFormat = (): Array<{ timestamp: number; status: 'up' | 'down' }> => {
    if (!uptimeLineData?.points || uptimeLineData.points.length === 0) {
      return [];
    }

    const graphData = [];
    const now = new Date();
    const startTime = new Date(now.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago
    
    // Create hourly data points from backend data
    for (let hour = 0; hour < 24; hour++) {
      const hourTime = new Date(startTime.getTime() + (hour * 60 * 60 * 1000));
      const hourTimestamp = hourTime.getTime();
      
      // Find the closest backend data point for this hour
      let closestPoint = uptimeLineData.points[0];
      let minDiff = Math.abs(hourTimestamp - new Date(closestPoint.time).getTime());
      
      for (const point of uptimeLineData.points) {
        const pointTime = new Date(point.time).getTime();
        const diff = Math.abs(hourTimestamp - pointTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestPoint = point;
        }
      }
      
      // Determine status based on online value (1 = online, 0 = offline)
      const status: 'up' | 'down' = closestPoint.online > 0 ? 'up' : 'down';
      
      graphData.push({ timestamp: hour, status });
    }
    
    return graphData;
  };

  // Generate hourly uptime/downtime data for one day (fallback)
  const generateHourlyData = () => {
    const data = [];
    // Generate 24 hours of data with realistic uptime/downtime patterns
    for (let hour = 0; hour < 24; hour++) {
      // Simulate some downtime periods (you can customize this logic)
      let status: 'up' | 'down';
      if (hour >= 2 && hour < 4) {
        status = 'down'; // Maintenance window
      } else if (hour >= 14 && hour < 16) {
        status = 'down'; // Another downtime period
      } else if (hour >= 22 || hour < 2) {
        status = 'down'; // Night time maintenance
      } else {
        status = 'up'; // Normal operation
      }
      
      data.push({ timestamp: hour, status });
    }
    return data;
  };

  // Use backend data if available, otherwise fall back to props or generated data
  const graphData = uptimeLineData ? convertBackendDataToGraphFormat() : 
                   (propData.length > 0 ? propData : generateHourlyData());
  
  // Calculate current hour based on real time
  const getCurrentHour = () => {
    const now = new Date();
    return now.getHours();
  };

  // Initialize current hour to real time
  useEffect(() => {
    const realCurrentHour = getCurrentHour();
    setCurrentHour(realCurrentHour);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchUptimeData();
    
    // Set up periodic refresh every 5 minutes
    const interval = setInterval(fetchUptimeData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // SVG dimensions
  const width = 900; 
  const height = 280; 
  const padding = 50;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Time labels for x-axis (every 2 hours) - with more granular spacing
  const timeLabels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'];
  const timePositions = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

  // Get color for each segment
  const getSegmentColor = (status: 'up' | 'down') => {
    return status === 'up' ? '#4CAF50' : '#F44336';
  };

  // Generate animated segments - now based on real current time
  const generateAnimatedSegments = () => {
    if (graphData.length === 0) return [];
    
    const xStep = chartWidth / 24;
    const upY = padding + 20;
    const downY = padding + chartHeight - 20;
    
    const segments = [];
    let currentStatus = graphData[0]?.status || 'up';
    let startX = padding;
    
    // Show all completed hours (up to current real time)
    for (let i = 1; i <= currentHour; i++) {
      if (i < graphData.length && graphData[i]?.status !== currentStatus) {
        // End of current segment
        const endX = padding + i * xStep;
        const y = currentStatus === 'up' ? upY : downY;
        
        segments.push({
          x1: startX,
          x2: endX,
          y: y,
          status: currentStatus,
          color: getSegmentColor(currentStatus),
          opacity: 1
        });
        
        // Start new segment
        currentStatus = graphData[i]?.status || 'up';
        startX = endX;
      }
    }
    
    // Add current segment (if not at end of day)
    if (currentHour < 23) {
      const endX = padding + (currentHour + 1) * xStep;
      const y = currentStatus === 'up' ? upY : downY;
      
      segments.push({
        x1: startX,
        x2: endX,
        y: y,
        status: currentStatus,
        color: getSegmentColor(currentStatus),
        opacity: 0.8
      });
    }
    
    return segments;
  };

  const segments = generateAnimatedSegments();

  // Progress animation based on real time updates
  useEffect(() => {
    const updateCurrentHour = () => {
      const realCurrentHour = getCurrentHour();
      setCurrentHour(realCurrentHour);
    };

    // Update every minute to show real-time progress
    const interval = setInterval(updateCurrentHour, 60 * 1000);
    
    // Initial update
    updateCurrentHour();
    
    return () => clearInterval(interval);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "secondary.main",
          border: "1px solid #e5e7eb",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" sx={{ mt: 2, color: "#666" }}>
          Loading uptime data...
        </Typography>
      </Paper>
    );
  }

  // Show error state
  if (error) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: "secondary.main",
          border: "1px solid #e5e7eb",
          height: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Error Loading Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <button 
          onClick={fetchUptimeData}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "secondary.main",
        border: "1px solid #e5e7eb",
        height: "600px",
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
        <svg width="100%" height={height} style={{ height: 'auto', maxHeight: '280px' }} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
          </defs>
          
          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Hourly vertical grid lines */}
          {Array.from({ length: 25 }, (_, i) => (
            <line
              key={`grid-${i}`}
              x1={padding + (i * chartWidth) / 24}
              y1={padding}
              x2={padding + (i * chartWidth) / 24}
              y2={height - padding}
              stroke="#e0e0e0"
              strokeWidth="1"
              opacity={0.5}
            />
          ))}
          
          {/* Status level lines */}
          <line
            x1={padding}
            y1={padding + 20}
            x2={width - padding}
            y2={padding + 20}
            stroke="#e0e0e0"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <line
            x1={padding}
            y1={padding + chartHeight - 20}
            x2={width - padding}
            y2={padding + chartHeight - 20}
            stroke="#e0e0e0"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          
          {/* Status labels */}
          <text
            x={padding - 10}
            y={padding + 25}
            textAnchor="end"
            fontSize="12"
            fill="#666"
          >
            Up
          </text>
          <text
            x={padding - 10}
            y={padding + chartHeight - 15}
            textAnchor="end"
            fontSize="12"
            fill="#666"
          >
            Down
          </text>
          
          {/* Animated step chart segments */}
          {segments.map((segment, index) => (
            <line
              key={index}
              x1={segment.x1}
              y1={segment.y}
              x2={segment.x2}
              y2={segment.y}
              stroke={segment.color}
              strokeWidth="3"
              strokeLinecap="round"
              opacity={segment.opacity}
            />
          ))}
          
          {/* Current hour indicator */}
          <line
            x1={padding + (currentHour * chartWidth) / 24}
            y1={padding}
            x2={padding + (currentHour * chartWidth) / 24}
            y2={height - padding}
            stroke="#2196F3"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Current status indicator */}
          <circle
            cx={padding + (currentHour * chartWidth) / 24}
            cy={graphData[currentHour]?.status === 'up' ? padding + 20 : padding + chartHeight - 20}
            r="6"
            fill={getSegmentColor(graphData[currentHour]?.status || 'up')}
            stroke="#fff"
            strokeWidth="2"
          />
          
          {/* Time labels with more spacing */}
          {timeLabels.map((label, index) => {
            const x = padding + (timePositions[index] * chartWidth) / 24;
            return (
              <text
                key={index}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="12"
                fill="#666"
                fontWeight="500"
              >
                {label}
              </text>
            );
          })}
          
          {/* Legend */}
          <rect
            x={padding}
            y={height - 40}
            width="12"
            height="12"
            fill="#4CAF50"
          />
          <text
            x={padding + 20}
            y={height - 30}
            fontSize="12"
            fill="#666"
          >
            Up
          </text>
          
          <rect
            x={padding + 60}
            y={height - 40}
            width="12"
            height="12"
            fill="#F44336"
          />
          <text
            x={padding + 80}
            y={height - 30}
            fontSize="12"
            fill="#666"
          >
            Down
          </text>

          <rect
            x={padding + 120}
            y={height - 40}
            width="12"
            height="12"
            fill="#2196F3"
          />
          <text
            x={padding + 140}
            y={height - 30}
            fontSize="12"
            fill="#666"
          >
            Current
          </text>
        </svg>
      </Box>
    </Paper>
  );
};

export default UptimeGraph;
