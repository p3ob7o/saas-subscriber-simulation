let startingSubscribers = 50000;
let newSubscribersPerMonth = 1500;
let initialMonthlyChurnRate = 4;

function calculateMetrics(startingSubscribers, newSubscribersPerMonth, acquisitionGrowth, monthlyChurnRate) {
    const totalSubscribers = [startingSubscribers];
    const newSubscribersData = [Math.round(newSubscribersPerMonth)];
    const churnedSubscribers = [startingSubscribers * (monthlyChurnRate / 100)]; // Calculating churn for the first month
    const growthRates = [null, null, null, null, null, null, null, null, null, null, null, null];
  
    let newSubscribers = newSubscribersPerMonth;
  
    for (let i = 1; i <= 60; i++) {
      newSubscribers += newSubscribers * (acquisitionGrowth / 100);
      let churningSubscribers = totalSubscribers[i - 1] * (monthlyChurnRate / 100);
  
      totalSubscribers[i] = totalSubscribers[i - 1] + newSubscribers - churningSubscribers;
      newSubscribersData[i] = newSubscribers;
      churnedSubscribers[i] = churningSubscribers;
    }
  
    for (let i = 12; i < totalSubscribers.length; i++) {
      growthRates[i] = ((totalSubscribers[i] / totalSubscribers[i - 12]) - 1) * 100;
    }
  
    return { totalSubscribers, newSubscribersData, churnedSubscribers, growthRates };
  }
  
let subscriberChart;

function renderChart(data, yoyGrowthData, newSubscribersMonthlyData,churnedSubscribersData) {
  const ctx = document.getElementById('subscriberChart').getContext('2d');

  if (subscriberChart) {
    subscriberChart.destroy();
  }

  subscriberChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...Array(61).keys()].map(x => x),
      datasets: [
        {
          label: 'Projection',
          data: data,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: 'YoY Growth Rate (%)',
          data: yoyGrowthData,
          borderColor: 'rgba(255, 165, 0, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          label: 'New Subscribers',
          data: newSubscribersMonthlyData,
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
            label: 'Churned Subscribers',
            data: churnedSubscribersData,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            yAxisID: 'y',
        }
      ]
    },
    options: {
        plugins: {
          legend: {
            labels: {
              font: {
                family: 'monospace'
              }
            }
          }
        },
        animation: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months',
              font: {
                family: 'monospace',
                color: '#303030'
              }
            },
            beginAtZero: true,
            ticks: {
              font: {
                family: 'monospace',
                color: '#303030'
              }
            },
            grid: {
              color: '#303030'
            }
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Total Subscribers',
              font: {
                family: 'monospace',
                color: '#303030'
              }
            },
            min: -100000,
            max: 500000,
            beginAtZero: false,
            ticks: {
              font: {
                family: 'monospace',
                color: '#303030'
              },
              callback: function(value, index, values) {
                // Only display positive values
                return value >= 0 ? value : null;
              }
            },
            grid: {
              color: '#303030'
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Growth Rate (%)',
              font: {
                family: 'monospace',
                color: '#303030'
              }
            },
            beginAtZero: false,
            min: -20,
            max: 100,
            grid: {
              drawOnChartArea: false,
              color: '#303030'
            },
            ticks: {
              font: {
                family: 'monospace',
                color: '#303030'
              }
            }
          }
        }
      }
    });
  }

function updateChart() {
    const acquisitionGrowth = parseFloat(document.getElementById('acquisitionGrowth').value);
    const monthlyChurnRate = parseFloat(document.getElementById('churnReduction').value);
  
    const metrics = calculateMetrics(startingSubscribers, newSubscribersPerMonth, acquisitionGrowth, monthlyChurnRate);

    const newSubscribersData = metrics.totalSubscribers;
    const yoyGrowthData = metrics.growthRates;
    const newSubscribersMonthlyData = metrics.newSubscribersData;
    const churnedSubscribersData = metrics.churnedSubscribers;
    
    renderChart(newSubscribersData, yoyGrowthData, newSubscribersMonthlyData, churnedSubscribersData);
    
  }
 
  function updateBaselineData() {
    startingSubscribers = parseInt(document.getElementById('startingSubscribers').value);
    newSubscribersPerMonth = parseInt(document.getElementById('netNewSubscribers').value);
}

    document.getElementById('acquisitionGrowth').oninput = function() {
        document.getElementById('acquisitionOutput').textContent = parseFloat(this.value).toFixed(1);
        let a = parseFloat(this.value);
        let b = 1 + (a / 100);
        let c = b ** 12;
        let d = (c - 1) * 100;
        document.getElementById('yearlyAcquisitionOutput').textContent = parseFloat(d).toFixed(0);
        updateChart();
    }
    
    document.getElementById('churnReduction').oninput = function() {
    document.getElementById('churnOutput').textContent = parseFloat(this.value).toFixed(1);
    let a = parseFloat(this.value);
        let b = 1 + (a / 100);
        let c = b ** 12;
        let d = (c - 1) * 100;
        document.getElementById('yearlyChurnOutput').textContent = parseFloat(d).toFixed(0);
    updateChart();
    }
    
    window.onload = () => {
    updateChart();
    };