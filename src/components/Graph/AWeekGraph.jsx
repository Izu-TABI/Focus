import React from 'react';
import 'chart.js/auto'; // ADD THIS
import 'chartjs-adapter-moment';
import 'chartjs-plugin-datalabels';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Scatter, Bar } from 'react-chartjs-2';
import { TimeScale } from "chart.js";
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: '1週間の作業記録',
    },
    formatter(value) {
        if (value === null || value === 0) {
          return '';
        }
        return `${value}%`
    },
  },
  
  
};

const labels = ['月', '火', '水', '木', '金', '土', '日'];

const data = {
  labels,
  datasets: [
    { 
      label: '作業時間（h）',
      data: [1, 0.5, 0, 5, 1, 2, 3, 4, 5, 6, 7],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const AWeekGraph = () => {
    
    return (
      <div style={{width: '60%', height: '300px',margin: '40px auto'}}>
        <Bar options={options} data={data} height={400} style={{margin: '0 auto'}}/>
      </div>
    );
}

export default AWeekGraph