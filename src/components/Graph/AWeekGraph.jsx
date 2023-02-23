import React, { useEffect, useState } from 'react';
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

import { Bar } from 'react-chartjs-2';
import { TimeScale } from "chart.js";
import { getDatabaseInfo } from '../../database/getDatabaseInfo';

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
        position: 'top',
      },
      title: {
        display: true,
        text: '1週間の作業記録',
      },
      
    },  
  };
const labels = ['月', '火', '水', '木', '金', '土', '日'];
let times = [0, 0, 0, 0, 0, 0, 0]
let data = {
    labels,
    datasets: [{ 
        label: '作業時間（h）',
        data: times,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
    }],
}


const AWeekGraph = () => {
    const [render, setRender] = useState(false);
    useEffect(() => {
        getDatabaseInfo().then((data) => {
            times = data.aWeekTotalTime
            times.forEach((element, i) => {
                times[i] = element / 3600
              });
        }).then(() => {
            data = {
                labels,
                datasets: [{ 
                    label: '作業時間（h）',
                    data: times,
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                }],
            }
            setRender(true)
            
        });
    })

    return (
      <div style={{width: '80vw', height: '300px', margin: '50px auto', display: 'flex', justifyContent: 'center'}} value={render}>
        <Bar options={options} data={data} height='550px' width='700px'/>
      </div>
    );
}

export default AWeekGraph