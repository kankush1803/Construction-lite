import React, { useState, useMemo } from 'react';
import ProductivityChart from '../components/charts/ProductivityChart';
import EquipmentUsageChart from '../components/charts/EquipmentUsageChart';
import ProjectProgressChart from '../components/charts/ProjectProgressChart';
import ManpowerChart from '../components/charts/ManpowerChart';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedProject, setSelectedProject] = useState('All');
  const [exportNotice, setExportNotice] = useState(null);

  // Timeframe and project metadata dictionaries
  const timeLabels = {
    '7d': '7 Days (Weekly Sprint)',
    '30d': '30 Days (Monthly Baseline)',
    '90d': 'Quarterly (90 Days)',
    'ytd': 'Year-to-Date (YTD)',
  };

  const projectCatalog = {
    All: {
      name: 'All Portfolio Projects',
      shortName: 'Portfolio',
      completion: 54.2,
      spi: 1.03,
      cpi: 1.11,
      oee: 84.4,
      manpowerEfficiency: 90.1,
      ltifr: '0.03',
      burnRate: '47.0% ($81.5M / $173.5M)',
      qualityYield: 97.5,
      trades: [
        { name: 'Civil & Earthworks', count: 126 },
        { name: 'Structural & Steel', count: 92 },
        { name: 'Mechanical & MEP', count: 54 },
        { name: 'Electrical Systems', count: 48 },
        { name: 'Heavy Equipment Ops', count: 42 },
        { name: 'Safety & QA Teams', count: 25 },
      ],
      timeframeData: {
        '7d': {
          productivity: [
            { day: 'Mon', planned: 86, actual: 86 },
            { day: 'Tue', planned: 86, actual: 89 },
            { day: 'Wed', planned: 87, actual: 90 },
            { day: 'Thu', planned: 87, actual: 88 },
            { day: 'Fri', planned: 89, actual: 91 },
            { day: 'Sat', planned: 76, actual: 80 },
            { day: 'Sun', planned: 72, actual: 77 },
          ],
          equipment: [
            { name: 'Excavators', operating: 42, idle: 9 },
            { name: 'Tower Cranes', operating: 46, idle: 6 },
            { name: 'Bulldozers', operating: 32, idle: 11 },
            { name: 'Dump Trucks', operating: 48, idle: 8 },
            { name: 'Concrete Mixers', operating: 38, idle: 5 },
          ],
          progress: [
            { month: 'Day 1', planned: 52.6, actual: 53.2 },
            { month: 'Day 2', planned: 52.8, actual: 53.4 },
            { month: 'Day 3', planned: 53.0, actual: 53.6 },
            { month: 'Day 4', planned: 53.2, actual: 53.8 },
            { month: 'Day 5', planned: 53.4, actual: 54.0 },
            { month: 'Day 6', planned: 53.6, actual: 54.1 },
            { month: 'Day 7', planned: 53.8, actual: 54.2 },
          ],
        },
        '30d': {
          productivity: [
            { day: 'Week 1', planned: 87, actual: 87 },
            { day: 'Week 2', planned: 87, actual: 89 },
            { day: 'Week 3', planned: 88, actual: 89 },
            { day: 'Week 4', planned: 89, actual: 91 },
          ],
          equipment: [
            { name: 'Excavators', operating: 168, idle: 36 },
            { name: 'Tower Cranes', operating: 184, idle: 24 },
            { name: 'Bulldozers', operating: 128, idle: 44 },
            { name: 'Dump Trucks', operating: 192, idle: 32 },
            { name: 'Concrete Mixers', operating: 152, idle: 20 },
          ],
          progress: [
            { month: 'Week 1', planned: 48.2, actual: 48.4 },
            { month: 'Week 2', planned: 50.3, actual: 50.3 },
            { month: 'Week 3', planned: 52.3, actual: 52.3 },
            { month: 'Week 4', planned: 54.1, actual: 54.2 },
          ],
        },
        '90d': {
          productivity: [
            { day: 'Aug', planned: 85, actual: 85 },
            { day: 'Sep', planned: 87, actual: 88 },
            { day: 'Oct', planned: 89, actual: 90 },
          ],
          equipment: [
            { name: 'Excavators', operating: 504, idle: 108 },
            { name: 'Tower Cranes', operating: 552, idle: 72 },
            { name: 'Bulldozers', operating: 384, idle: 132 },
            { name: 'Dump Trucks', operating: 576, idle: 96 },
            { name: 'Concrete Mixers', operating: 456, idle: 60 },
          ],
          progress: [
            { month: 'Aug', planned: 38.8, actual: 39.1 },
            { month: 'Sep', planned: 46.4, actual: 46.6 },
            { month: 'Oct', planned: 54.1, actual: 54.2 },
          ],
        },
        'ytd': {
          productivity: [
            { day: 'May', planned: 81, actual: 80 },
            { day: 'Jun', planned: 83, actual: 82 },
            { day: 'Jul', planned: 85, actual: 85 },
            { day: 'Aug', planned: 87, actual: 88 },
            { day: 'Sep', planned: 88, actual: 89 },
            { day: 'Oct', planned: 89, actual: 91 },
          ],
          equipment: [
            { name: 'Excavators', operating: 1176, idle: 252 },
            { name: 'Tower Cranes', operating: 1288, idle: 168 },
            { name: 'Bulldozers', operating: 896, idle: 308 },
            { name: 'Dump Trucks', operating: 1344, idle: 224 },
            { name: 'Concrete Mixers', operating: 1064, idle: 140 },
          ],
          progress: [
            { month: 'May', planned: 13.8, actual: 14.5 },
            { month: 'Jun', planned: 21.7, actual: 22.6 },
            { month: 'Jul', planned: 30.2, actual: 31.3 },
            { month: 'Aug', planned: 38.8, actual: 39.1 },
            { month: 'Sep', planned: 46.4, actual: 46.6 },
            { month: 'Oct', planned: 54.1, actual: 54.2 },
          ],
        },
      },
    },

    1: {
      name: 'Skyline Heights Tower A',
      shortName: 'Skyline Heights',
      completion: 68.5,
      spi: 1.05,
      cpi: 1.12,
      oee: 87.8,
      manpowerEfficiency: 93.6,
      ltifr: '0.00',
      burnRate: '63.3% ($28.5M / $45.0M)',
      qualityYield: 98.6,
      trades: [
        { name: 'Civil & Concrete', count: 46 },
        { name: 'Structural Steel', count: 38 },
        { name: 'Mechanical & HVAC', count: 24 },
        { name: 'Electrical & Telecom', count: 18 },
        { name: 'Safety & Rigging', count: 6 },
      ],
      timeframeData: {
        '7d': {
          productivity: [
            { day: 'Mon', planned: 86, actual: 90 },
            { day: 'Tue', planned: 86, actual: 92 },
            { day: 'Wed', planned: 88, actual: 94 },
            { day: 'Thu', planned: 88, actual: 91 },
            { day: 'Fri', planned: 90, actual: 95 },
            { day: 'Sat', planned: 75, actual: 84 },
            { day: 'Sun', planned: 70, actual: 80 },
          ],
          equipment: [
            { name: 'Tower Cranes', operating: 48, idle: 4 },
            { name: 'Concrete Mixers', operating: 36, idle: 5 },
            { name: 'Material Hoists', operating: 42, idle: 3 },
            { name: 'Excavators', operating: 30, idle: 8 },
            { name: 'Generators', operating: 54, idle: 2 },
          ],
          progress: [
            { month: 'Day 1', planned: 67.0, actual: 67.3 },
            { month: 'Day 2', planned: 67.2, actual: 67.5 },
            { month: 'Day 3', planned: 67.4, actual: 67.7 },
            { month: 'Day 4', planned: 67.6, actual: 67.9 },
            { month: 'Day 5', planned: 67.8, actual: 68.1 },
            { month: 'Day 6', planned: 68.0, actual: 68.3 },
            { month: 'Day 7', planned: 68.2, actual: 68.5 },
          ],
        },
        '30d': {
          productivity: [
            { day: 'Week 1', planned: 88, actual: 91 },
            { day: 'Week 2', planned: 88, actual: 93 },
            { day: 'Week 3', planned: 89, actual: 92 },
            { day: 'Week 4', planned: 90, actual: 95 },
          ],
          equipment: [
            { name: 'Tower Cranes', operating: 192, idle: 18 },
            { name: 'Concrete Mixers', operating: 144, idle: 22 },
            { name: 'Material Hoists', operating: 168, idle: 14 },
            { name: 'Excavators', operating: 120, idle: 32 },
            { name: 'Generators', operating: 216, idle: 10 },
          ],
          progress: [
            { month: 'Week 1', planned: 61.0, actual: 62.0 },
            { month: 'Week 2', planned: 63.5, actual: 64.2 },
            { month: 'Week 3', planned: 66.0, actual: 66.5 },
            { month: 'Week 4', planned: 68.0, actual: 68.5 },
          ],
        },
        '90d': {
          productivity: [
            { day: 'Aug', planned: 86, actual: 89 },
            { day: 'Sep', planned: 88, actual: 92 },
            { day: 'Oct', planned: 90, actual: 94 },
          ],
          equipment: [
            { name: 'Tower Cranes', operating: 576, idle: 54 },
            { name: 'Concrete Mixers', operating: 432, idle: 66 },
            { name: 'Material Hoists', operating: 504, idle: 42 },
            { name: 'Excavators', operating: 360, idle: 96 },
            { name: 'Generators', operating: 648, idle: 30 },
          ],
          progress: [
            { month: 'Aug', planned: 50.0, actual: 52.0 },
            { month: 'Sep', planned: 59.0, actual: 60.5 },
            { month: 'Oct', planned: 68.0, actual: 68.5 },
          ],
        },
        'ytd': {
          productivity: [
            { day: 'May', planned: 82, actual: 84 },
            { day: 'Jun', planned: 84, actual: 87 },
            { day: 'Jul', planned: 86, actual: 90 },
            { day: 'Aug', planned: 88, actual: 91 },
            { day: 'Sep', planned: 89, actual: 93 },
            { day: 'Oct', planned: 90, actual: 95 },
          ],
          equipment: [
            { name: 'Tower Cranes', operating: 1344, idle: 126 },
            { name: 'Concrete Mixers', operating: 1008, idle: 154 },
            { name: 'Material Hoists', operating: 1176, idle: 98 },
            { name: 'Excavators', operating: 840, idle: 224 },
            { name: 'Generators', operating: 1512, idle: 70 },
          ],
          progress: [
            { month: 'May', planned: 16.0, actual: 18.0 },
            { month: 'Jun', planned: 27.0, actual: 29.5 },
            { month: 'Jul', planned: 38.0, actual: 41.0 },
            { month: 'Aug', planned: 50.0, actual: 52.0 },
            { month: 'Sep', planned: 59.0, actual: 60.5 },
            { month: 'Oct', planned: 68.0, actual: 68.5 },
          ],
        },
      },
    },

    2: {
      name: 'Riverfront Commercial Plaza',
      shortName: 'Riverfront Plaza',
      completion: 43.0,
      spi: 0.93,
      cpi: 1.08,
      oee: 76.5,
      manpowerEfficiency: 82.4,
      ltifr: '0.12',
      burnRate: '43.1% ($31.0M / $72.0M)',
      qualityYield: 94.2,
      trades: [
        { name: 'Foundation Crew', count: 36 },
        { name: 'Concrete Pouring', count: 28 },
        { name: 'Steel Fixing', count: 22 },
        { name: 'Logistics & Hauling', count: 14 },
        { name: 'Cranes & Rigging', count: 12 },
      ],
      timeframeData: {
        '7d': {
          productivity: [
            { day: 'Mon', planned: 85, actual: 78 },
            { day: 'Tue', planned: 85, actual: 80 },
            { day: 'Wed', planned: 86, actual: 82 },
            { day: 'Thu', planned: 86, actual: 79 },
            { day: 'Fri', planned: 88, actual: 81 },
            { day: 'Sat', planned: 75, actual: 74 },
            { day: 'Sun', planned: 70, actual: 70 },
          ],
          equipment: [
            { name: 'Hydraulic Piling', operating: 44, idle: 14 },
            { name: 'Heavy Excavators', operating: 38, idle: 16 },
            { name: 'Dump Trucks', operating: 46, idle: 12 },
            { name: 'Crawler Cranes', operating: 32, idle: 8 },
            { name: 'Dewatering Pumps', operating: 56, idle: 4 },
          ],
          progress: [
            { month: 'Day 1', planned: 45.8, actual: 42.2 },
            { month: 'Day 2', planned: 46.0, actual: 42.3 },
            { month: 'Day 3', planned: 46.2, actual: 42.5 },
            { month: 'Day 4', planned: 46.4, actual: 42.6 },
            { month: 'Day 5', planned: 46.6, actual: 42.8 },
            { month: 'Day 6', planned: 46.8, actual: 42.9 },
            { month: 'Day 7', planned: 47.0, actual: 43.0 },
          ],
        },
        '30d': {
          productivity: [
            { day: 'Week 1', planned: 86, actual: 81 },
            { day: 'Week 2', planned: 86, actual: 83 },
            { day: 'Week 3', planned: 87, actual: 80 },
            { day: 'Week 4', planned: 88, actual: 84 },
          ],
          equipment: [
            { name: 'Hydraulic Piling', operating: 176, idle: 56 },
            { name: 'Heavy Excavators', operating: 152, idle: 64 },
            { name: 'Dump Trucks', operating: 184, idle: 48 },
            { name: 'Crawler Cranes', operating: 128, idle: 32 },
            { name: 'Dewatering Pumps', operating: 224, idle: 16 },
          ],
          progress: [
            { month: 'Week 1', planned: 42.0, actual: 38.0 },
            { month: 'Week 2', planned: 43.8, actual: 39.5 },
            { month: 'Week 3', planned: 45.5, actual: 41.2 },
            { month: 'Week 4', planned: 47.0, actual: 43.0 },
          ],
        },
        '90d': {
          productivity: [
            { day: 'Aug', planned: 85, actual: 79 },
            { day: 'Sep', planned: 86, actual: 81 },
            { day: 'Oct', planned: 87, actual: 83 },
          ],
          equipment: [
            { name: 'Hydraulic Piling', operating: 528, idle: 168 },
            { name: 'Heavy Excavators', operating: 456, idle: 192 },
            { name: 'Dump Trucks', operating: 552, idle: 144 },
            { name: 'Crawler Cranes', operating: 384, idle: 96 },
            { name: 'Dewatering Pumps', operating: 672, idle: 48 },
          ],
          progress: [
            { month: 'Aug', planned: 34.0, actual: 29.0 },
            { month: 'Sep', planned: 40.5, actual: 36.0 },
            { month: 'Oct', planned: 47.0, actual: 43.0 },
          ],
        },
        'ytd': {
          productivity: [
            { day: 'May', planned: 82, actual: 76 },
            { day: 'Jun', planned: 83, actual: 78 },
            { day: 'Jul', planned: 85, actual: 80 },
            { day: 'Aug', planned: 86, actual: 82 },
            { day: 'Sep', planned: 87, actual: 81 },
            { day: 'Oct', planned: 88, actual: 83 },
          ],
          equipment: [
            { name: 'Hydraulic Piling', operating: 1232, idle: 392 },
            { name: 'Heavy Excavators', operating: 1064, idle: 448 },
            { name: 'Dump Trucks', operating: 1288, idle: 336 },
            { name: 'Crawler Cranes', operating: 896, idle: 224 },
            { name: 'Dewatering Pumps', operating: 1568, idle: 112 },
          ],
          progress: [
            { month: 'May', planned: 14.0, actual: 12.0 },
            { month: 'Jun', planned: 21.0, actual: 18.0 },
            { month: 'Jul', planned: 28.0, actual: 24.0 },
            { month: 'Aug', planned: 34.0, actual: 29.0 },
            { month: 'Sep', planned: 40.5, actual: 36.0 },
            { month: 'Oct', planned: 47.0, actual: 43.0 },
          ],
        },
      },
    },

    3: {
      name: 'Greenwood Logistics Hub',
      shortName: 'Greenwood Hub',
      completion: 91.2,
      spi: 1.12,
      cpi: 1.18,
      oee: 91.6,
      manpowerEfficiency: 96.8,
      ltifr: '0.00',
      burnRate: '90.8% ($16.8M / $18.5M)',
      qualityYield: 99.4,
      trades: [
        { name: 'Steel Erectors', count: 32 },
        { name: 'Pavement & Civils', count: 26 },
        { name: 'Industrial Electrical', count: 22 },
        { name: 'Dock Systems Assembly', count: 18 },
        { name: 'QA & Safety Officers', count: 8 },
      ],
      timeframeData: {
        '7d': {
          productivity: [
            { day: 'Mon', planned: 88, actual: 94 },
            { day: 'Tue', planned: 88, actual: 96 },
            { day: 'Wed', planned: 90, actual: 97 },
            { day: 'Thu', planned: 90, actual: 95 },
            { day: 'Fri', planned: 92, actual: 98 },
            { day: 'Sat', planned: 78, actual: 88 },
            { day: 'Sun', planned: 75, actual: 85 },
          ],
          equipment: [
            { name: 'Motor Graders', operating: 46, idle: 4 },
            { name: 'Asphalt Pavers', operating: 42, idle: 3 },
            { name: 'Heavy Forklifts', operating: 50, idle: 5 },
            { name: 'Compaction Rollers', operating: 38, idle: 6 },
            { name: 'Dump Trucks', operating: 48, idle: 4 },
          ],
          progress: [
            { month: 'Day 1', planned: 87.2, actual: 90.2 },
            { month: 'Day 2', planned: 87.4, actual: 90.4 },
            { month: 'Day 3', planned: 87.5, actual: 90.6 },
            { month: 'Day 4', planned: 87.7, actual: 90.8 },
            { month: 'Day 5', planned: 87.8, actual: 91.0 },
            { month: 'Day 6', planned: 87.9, actual: 91.1 },
            { month: 'Day 7', planned: 88.0, actual: 91.2 },
          ],
        },
        '30d': {
          productivity: [
            { day: 'Week 1', planned: 89, actual: 93 },
            { day: 'Week 2', planned: 90, actual: 95 },
            { day: 'Week 3', planned: 91, actual: 96 },
            { day: 'Week 4', planned: 92, actual: 98 },
          ],
          equipment: [
            { name: 'Motor Graders', operating: 184, idle: 16 },
            { name: 'Asphalt Pavers', operating: 168, idle: 12 },
            { name: 'Heavy Forklifts', operating: 200, idle: 20 },
            { name: 'Compaction Rollers', operating: 152, idle: 24 },
            { name: 'Dump Trucks', operating: 192, idle: 16 },
          ],
          progress: [
            { month: 'Week 1', planned: 82.0, actual: 85.0 },
            { month: 'Week 2', planned: 84.0, actual: 87.2 },
            { month: 'Week 3', planned: 86.0, actual: 89.4 },
            { month: 'Week 4', planned: 88.0, actual: 91.2 },
          ],
        },
        '90d': {
          productivity: [
            { day: 'Aug', planned: 88, actual: 92 },
            { day: 'Sep', planned: 90, actual: 95 },
            { day: 'Oct', planned: 92, actual: 97 },
          ],
          equipment: [
            { name: 'Motor Graders', operating: 552, idle: 48 },
            { name: 'Asphalt Pavers', operating: 504, idle: 36 },
            { name: 'Heavy Forklifts', operating: 600, idle: 60 },
            { name: 'Compaction Rollers', operating: 456, idle: 72 },
            { name: 'Dump Trucks', operating: 576, idle: 48 },
          ],
          progress: [
            { month: 'Aug', planned: 68.0, actual: 72.0 },
            { month: 'Sep', planned: 78.5, actual: 82.0 },
            { month: 'Oct', planned: 88.0, actual: 91.2 },
          ],
        },
        'ytd': {
          productivity: [
            { day: 'May', planned: 85, actual: 88 },
            { day: 'Jun', planned: 87, actual: 90 },
            { day: 'Jul', planned: 89, actual: 93 },
            { day: 'Aug', planned: 90, actual: 95 },
            { day: 'Sep', planned: 91, actual: 96 },
            { day: 'Oct', planned: 92, actual: 98 },
          ],
          equipment: [
            { name: 'Motor Graders', operating: 1288, idle: 112 },
            { name: 'Asphalt Pavers', operating: 1176, idle: 84 },
            { name: 'Heavy Forklifts', operating: 1400, idle: 140 },
            { name: 'Compaction Rollers', operating: 1064, idle: 168 },
            { name: 'Dump Trucks', operating: 1344, idle: 112 },
          ],
          progress: [
            { month: 'May', planned: 25.0, actual: 28.0 },
            { month: 'Jun', planned: 38.0, actual: 42.0 },
            { month: 'Jul', planned: 53.0, actual: 58.0 },
            { month: 'Aug', planned: 68.0, actual: 72.0 },
            { month: 'Sep', planned: 78.5, actual: 82.0 },
            { month: 'Oct', planned: 88.0, actual: 91.2 },
          ],
        },
      },
    },

    4: {
      name: 'Oakwood Medical Center',
      shortName: 'Oakwood Medical',
      completion: 14.0,
      spi: 1.01,
      cpi: 1.06,
      oee: 82.0,
      manpowerEfficiency: 87.5,
      ltifr: '0.00',
      burnRate: '13.7% ($5.2M / $38.0M)',
      qualityYield: 97.8,
      trades: [
        { name: 'Civil & Earthworks', count: 16 },
        { name: 'Substructure & Piling', count: 12 },
        { name: 'Mechanical & Plumbing', count: 8 },
        { name: 'Heavy Equipment Operators', count: 6 },
        { name: 'Safety & Compliance', count: 3 },
      ],
      timeframeData: {
        '7d': {
          productivity: [
            { day: 'Mon', planned: 84, actual: 84 },
            { day: 'Tue', planned: 84, actual: 86 },
            { day: 'Wed', planned: 85, actual: 87 },
            { day: 'Thu', planned: 85, actual: 85 },
            { day: 'Fri', planned: 86, actual: 88 },
            { day: 'Sat', planned: 74, actual: 76 },
            { day: 'Sun', planned: 70, actual: 72 },
          ],
          equipment: [
            { name: 'Mobile Cranes', operating: 32, idle: 6 },
            { name: 'Mini Excavators', operating: 36, idle: 8 },
            { name: 'Scissor Lifts', operating: 28, idle: 10 },
            { name: 'Telehandlers', operating: 34, idle: 5 },
            { name: 'Site Utility Trucks', operating: 42, idle: 6 },
          ],
          progress: [
            { month: 'Day 1', planned: 12.5, actual: 13.2 },
            { month: 'Day 2', planned: 12.7, actual: 13.4 },
            { month: 'Day 3', planned: 12.9, actual: 13.5 },
            { month: 'Day 4', planned: 13.1, actual: 13.7 },
            { month: 'Day 5', planned: 13.2, actual: 13.8 },
            { month: 'Day 6', planned: 13.4, actual: 13.9 },
            { month: 'Day 7', planned: 13.5, actual: 14.0 },
          ],
        },
        '30d': {
          productivity: [
            { day: 'Week 1', planned: 84, actual: 83 },
            { day: 'Week 2', planned: 85, actual: 85 },
            { day: 'Week 3', planned: 85, actual: 87 },
            { day: 'Week 4', planned: 86, actual: 88 },
          ],
          equipment: [
            { name: 'Mobile Cranes', operating: 128, idle: 24 },
            { name: 'Mini Excavators', operating: 144, idle: 32 },
            { name: 'Scissor Lifts', operating: 112, idle: 40 },
            { name: 'Telehandlers', operating: 136, idle: 20 },
            { name: 'Site Utility Trucks', operating: 168, idle: 24 },
          ],
          progress: [
            { month: 'Week 1', planned: 8.0, actual: 8.5 },
            { month: 'Week 2', planned: 9.8, actual: 10.2 },
            { month: 'Week 3', planned: 11.6, actual: 12.1 },
            { month: 'Week 4', planned: 13.5, actual: 14.0 },
          ],
        },
        '90d': {
          productivity: [
            { day: 'Aug', planned: 82, actual: 80 },
            { day: 'Sep', planned: 84, actual: 84 },
            { day: 'Oct', planned: 86, actual: 87 },
          ],
          equipment: [
            { name: 'Mobile Cranes', operating: 384, idle: 72 },
            { name: 'Mini Excavators', operating: 432, idle: 96 },
            { name: 'Scissor Lifts', operating: 336, idle: 120 },
            { name: 'Telehandlers', operating: 408, idle: 60 },
            { name: 'Site Utility Trucks', operating: 504, idle: 72 },
          ],
          progress: [
            { month: 'Aug', planned: 3.0, actual: 3.5 },
            { month: 'Sep', planned: 7.5, actual: 8.0 },
            { month: 'Oct', planned: 13.5, actual: 14.0 },
          ],
        },
        'ytd': {
          productivity: [
            { day: 'May', planned: 75, actual: 72 },
            { day: 'Jun', planned: 78, actual: 75 },
            { day: 'Jul', planned: 81, actual: 79 },
            { day: 'Aug', planned: 83, actual: 82 },
            { day: 'Sep', planned: 85, actual: 85 },
            { day: 'Oct', planned: 86, actual: 88 },
          ],
          equipment: [
            { name: 'Mobile Cranes', operating: 896, idle: 168 },
            { name: 'Mini Excavators', operating: 1008, idle: 224 },
            { name: 'Scissor Lifts', operating: 784, idle: 280 },
            { name: 'Telehandlers', operating: 952, idle: 140 },
            { name: 'Site Utility Trucks', operating: 1176, idle: 168 },
          ],
          progress: [
            { month: 'May', planned: 0.0, actual: 0.0 },
            { month: 'Jun', planned: 0.8, actual: 1.0 },
            { month: 'Jul', planned: 1.8, actual: 2.0 },
            { month: 'Aug', planned: 3.0, actual: 3.5 },
            { month: 'Sep', planned: 7.5, actual: 8.0 },
            { month: 'Oct', planned: 13.5, actual: 14.0 },
          ],
        },
      },
    },
  };

  // Dynamically compute all numbers, chart series, and benchmarks
  const analyticsData = useMemo(() => {
    const profile = projectCatalog[selectedProject] || projectCatalog.All;
    const timeDataset = profile.timeframeData[timeRange] || profile.timeframeData['30d'];

    // 1. Productivity metrics
    const prodList = timeDataset.productivity;
    const avgActualProd = (prodList.reduce((acc, p) => acc + p.actual, 0) / prodList.length).toFixed(1);
    const avgPlannedProd = (prodList.reduce((acc, p) => acc + p.planned, 0) / prodList.length).toFixed(1);
    const prodVariance = (avgActualProd - avgPlannedProd).toFixed(1);

    // 2. Equipment operating hours metrics
    const eqList = timeDataset.equipment;
    const totalOperating = eqList.reduce((acc, e) => acc + e.operating, 0);
    const totalIdle = eqList.reduce((acc, e) => acc + e.idle, 0);
    const fleetEfficiency = (((totalOperating) / (totalOperating + totalIdle)) * 100).toFixed(1);

    // 3. Progress metrics
    const progList = timeDataset.progress;
    const latestProgressPoint = progList[progList.length - 1];
    const latestActualProg = latestProgressPoint?.actual || profile.completion;
    const latestPlannedProg = latestProgressPoint?.planned || profile.completion;
    const progDelta = (latestActualProg - latestPlannedProg).toFixed(1);

    // 4. Manpower metrics
    const trades = profile.trades;
    const totalCrew = trades.reduce((acc, t) => acc + t.count, 0);

    // 5. Performance table rows
    const tableRows = [
      {
        metric: 'Overall Equipment Effectiveness (OEE)',
        current: `${profile.oee.toFixed(1)}%`,
        benchmark: '80.0%',
        status: profile.oee >= 85 ? 'Optimal' : profile.oee >= 80 ? 'Healthy' : 'Warning',
        statusClass: profile.oee >= 85 ? 'normal' : profile.oee >= 80 ? 'normal' : 'warning',
        delta: `${profile.oee >= 80 ? '+' : ''}${(profile.oee - 80).toFixed(1)}% vs benchmark`,
        deltaColor: profile.oee >= 80 ? 'var(--color-success)' : 'var(--color-warning)',
      },
      {
        metric: 'Schedule Performance Index (SPI)',
        current: profile.spi.toFixed(2),
        benchmark: '1.00',
        status: profile.spi >= 1.05 ? 'Optimal' : profile.spi >= 1.0 ? 'Healthy' : 'Warning',
        statusClass: profile.spi >= 1.0 ? 'normal' : 'warning',
        delta: profile.spi >= 1.0 ? `+${(profile.spi - 1.0).toFixed(2)} Ahead of Schedule` : `${(profile.spi - 1.0).toFixed(2)} Behind Schedule`,
        deltaColor: profile.spi >= 1.0 ? 'var(--color-success)' : 'var(--color-danger)',
      },
      {
        metric: 'Cost Performance Index (CPI)',
        current: profile.cpi.toFixed(2),
        benchmark: '1.00',
        status: profile.cpi >= 1.10 ? 'Optimal' : profile.cpi >= 1.0 ? 'Healthy' : 'Warning',
        statusClass: 'normal',
        delta: `+${(profile.cpi - 1.0).toFixed(2)} Under Budget`,
        deltaColor: 'var(--color-success)',
      },
      {
        metric: 'Manpower Productivity Efficiency',
        current: `${profile.manpowerEfficiency.toFixed(1)}%`,
        benchmark: '88.0%',
        status: profile.manpowerEfficiency >= 92 ? 'Optimal' : profile.manpowerEfficiency >= 88 ? 'Healthy' : 'Warning',
        statusClass: profile.manpowerEfficiency >= 88 ? 'normal' : 'warning',
        delta: `${profile.manpowerEfficiency >= 88 ? '+' : ''}${(profile.manpowerEfficiency - 88).toFixed(1)}% vs Target`,
        deltaColor: profile.manpowerEfficiency >= 88 ? 'var(--color-success)' : 'var(--color-warning)',
      },
      {
        metric: 'Lost Time Incident Frequency (LTIFR)',
        current: profile.ltifr,
        benchmark: '0.50',
        status: profile.ltifr === '0.00' ? 'Optimal' : 'Warning',
        statusClass: profile.ltifr === '0.00' ? 'normal' : 'warning',
        delta: profile.ltifr === '0.00' ? 'Zero Incidents Recorded' : '1 Incident / Near-Miss Under Review',
        deltaColor: profile.ltifr === '0.00' ? 'var(--color-success)' : 'var(--color-danger)',
      },
      {
        metric: 'Budget Capital Burn Rate',
        current: profile.burnRate,
        benchmark: 'Milestone Aligned',
        status: 'Healthy',
        statusClass: 'normal',
        delta: 'Capital Expenditure Fully Controlled',
        deltaColor: 'var(--color-text-secondary)',
      },
      {
        metric: 'Quality Inspection First-Pass Yield',
        current: `${profile.qualityYield.toFixed(1)}%`,
        benchmark: '95.0%',
        status: profile.qualityYield >= 98 ? 'Optimal' : profile.qualityYield >= 95 ? 'Healthy' : 'Warning',
        statusClass: profile.qualityYield >= 95 ? 'normal' : 'warning',
        delta: `${profile.qualityYield >= 95 ? '+' : ''}${(profile.qualityYield - 95).toFixed(1)}% Quality Delta`,
        deltaColor: profile.qualityYield >= 95 ? 'var(--color-success)' : 'var(--color-warning)',
      },
    ];

    return {
      profile,
      timeDataset,
      avgActualProd,
      avgPlannedProd,
      prodVariance,
      totalOperating,
      totalIdle,
      fleetEfficiency,
      latestActualProg,
      progDelta,
      totalCrew,
      tableRows,
      timeframeLabel: timeLabels[timeRange],
    };
  }, [timeRange, selectedProject]);

  const handleExport = () => {
    const msg = `Exporting Executive Analytics Report for "${analyticsData.profile.name}" (${analyticsData.timeframeLabel})...`;
    setExportNotice(msg);
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Control Filter Bar */}
      <div
        className="card-shell"
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Timeframe Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>Timeframe:</span>
            <div className="btn-group">
              {[
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '90d', label: 'Quarterly' },
                { id: 'ytd', label: 'YTD' },
              ].map((t) => (
                <button
                  key={t.id}
                  className={`btn ${timeRange === t.id ? 'active' : ''}`}
                  onClick={() => setTimeRange(t.id)}
                  style={{
                    height: '32px',
                    fontSize: '12px',
                    padding: '0 12px',
                    fontWeight: timeRange === t.id ? 600 : 500,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scope / Project Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>Scope:</span>
            <select
              className="filter-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{ width: '180px', height: '32px', fontSize: '12px', fontWeight: 500 }}
            >
              <option value="All">All Portfolio Projects</option>
              <option value="1">Skyline Heights</option>
              <option value="2">Riverfront Plaza</option>
              <option value="3">Greenwood Hub</option>
              <option value="4">Oakwood Medical</option>
            </select>
          </div>

          {/* Filter Status Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              backgroundColor: 'var(--color-bg-light, #F3F5F6)',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></span>
            <span>
              Scope: <strong>{analyticsData.profile.shortName}</strong> &bull; Period: <strong>{analyticsData.timeframeLabel}</strong>
            </span>
          </div>
        </div>

        {/* Export Executive Report */}
        <button
          className="btn btn-secondary"
          style={{ height: '32px', fontSize: '12px', gap: '6px' }}
          onClick={handleExport}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* Export notification toast if triggered */}
      {exportNotice && (
        <div
          className="card-shell"
          style={{
            padding: '10px 16px',
            backgroundColor: '#E8F5F2',
            border: '1px solid #5CB5A4',
            color: '#1F5E52',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 4 Interactive Executive KPI Stat Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* KPI 1: Workforce Productivity */}
        <div className="card-shell" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Workforce Productivity
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: 'rgba(75, 168, 204, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary)',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>
              {analyticsData.avgActualProd}%
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: Number(analyticsData.prodVariance) >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
              }}
            >
              {Number(analyticsData.prodVariance) >= 0 ? `+${analyticsData.prodVariance}%` : `${analyticsData.prodVariance}%`}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Target: {analyticsData.avgPlannedProd}% &bull; {analyticsData.timeframeLabel}
          </span>
        </div>

        {/* KPI 2: Total Fleet Operating Hours */}
        <div className="card-shell" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Fleet Operating Hours
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: 'rgba(92, 181, 164, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5CB5A4',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>
              {analyticsData.totalOperating.toLocaleString()} hrs
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#5CB5A4' }}>
              {analyticsData.fleetEfficiency}% util
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Idle Standby: {analyticsData.totalIdle.toLocaleString()} hrs logged
          </span>
        </div>

        {/* KPI 3: S-Curve Progress Milestone */}
        <div className="card-shell" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Progress Completion
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: 'rgba(168, 164, 232, 0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7774D6',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>
              {analyticsData.latestActualProg}%
            </span>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: Number(analyticsData.progDelta) >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
              }}
            >
              {Number(analyticsData.progDelta) >= 0 ? `+${analyticsData.progDelta}%` : `${analyticsData.progDelta}%`}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            SPI: {analyticsData.profile.spi.toFixed(2)} &bull; CPI: {analyticsData.profile.cpi.toFixed(2)}
          </span>
        </div>

        {/* KPI 4: Active Deployed Workforce */}
        <div className="card-shell" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Deployed Workforce
            </span>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: 'rgba(40, 111, 141, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary-dark)',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)' }}>
              {analyticsData.totalCrew} crew
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-success)' }}>
              {analyticsData.profile.manpowerEfficiency}% eff
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Across {analyticsData.profile.trades.length} active trade divisions
          </span>
        </div>
      </div>

      {/* 2x2 Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        <ProductivityChart
          data={analyticsData.timeDataset.productivity}
          title={`Workforce Productivity Trend (% Target) — ${analyticsData.profile.shortName}`}
        />
        <EquipmentUsageChart
          data={analyticsData.timeDataset.equipment}
          title={`Fleet Operating vs Idle Hours (${timeRange.toUpperCase()}) — ${analyticsData.profile.shortName}`}
        />
        <ProjectProgressChart
          data={analyticsData.timeDataset.progress}
          title={`Cumulative S-Curve Progress vs Baseline — ${analyticsData.profile.shortName}`}
        />
        <ManpowerChart
          data={analyticsData.profile.trades}
          title={`Workforce Trade Roster — ${analyticsData.profile.shortName}`}
        />
      </div>

      {/* Benchmark Summary Table */}
      <div className="card-shell">
        <div className="widget-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="widget-title">
              Executive Performance Benchmarks & Indices &mdash; {analyticsData.profile.name}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Evaluated against industry standards for {analyticsData.timeframeLabel}
            </span>
          </div>
          <span
            className="status-badge normal"
            style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}
          >
            Telemetry Verified
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Operational Index / Key Metric</th>
                <th>Current Measured</th>
                <th>Industry Standard Target</th>
                <th>Status</th>
                <th>Variance / Performance Impact</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.tableRows.map((m) => (
                <tr key={m.metric}>
                  <td><strong>{m.metric}</strong></td>
                  <td><strong style={{ color: 'var(--color-primary-dark)' }}>{m.current}</strong></td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{m.benchmark}</td>
                  <td>
                    <span className={`status-badge ${m.statusClass}`}>{m.status}</span>
                  </td>
                  <td style={{ color: m.deltaColor, fontWeight: 600 }}>{m.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
