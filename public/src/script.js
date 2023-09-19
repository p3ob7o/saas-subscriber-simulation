let startingSubscribersCount = 50000;
let newSubscribersCountPerMonth = 1500;
let initialMonthlyChurnRate = 4;

function calculateMetrics(startingSubscribersCount, newSubscribersCountPerMonth, acquisitionGrowthRate, monthlyChurnRate) {
    const totalSubscribersArray = [startingSubscribersCount];
    const newSubscribersDataArray = [Math.round(newSubscribersCountPerMonth)];
    const churnedSubscribersArray = [startingSubscribersCount * (monthlyChurnRate / 100)]; // Calculating churn for the first month
    const growthRatesArray = [null, null, null, null, null, null, null, null, null, null, null, null];
  
    let newSubscribersCount = newSubscribersCountPerMonth;
  
    for (let i = 1; i <= 60; i++) {
      newSubscribersCount += newSubscribersCount * (acquisitionGrowthRate / 100);
      let churningSubscribersCount = totalSubscribersArray[i - 1] * (monthlyChurnRate / 100);
  
      totalSubscribersArray[i] = totalSubscribersArray[i - 1] + newSubscribersCount - churningSubscribersCount;
      newSubscribersDataArray[i] = newSubscribersCount;
      churnedSubscribersArray[i] = churningSubscribersCount;
    }
  
    for (let i = 12; i < totalSubscribersArray.length; i++) {
      growthRatesArray[i] = ((totalSubscribersArray[i] / totalSubscribersArray[i - 12]) - 1) * 100;
    }
  
    return { totalSubscribersArray, newSubscribersDataArray, churnedSubscribersArray, growthRatesArray };
}

let subscriberChartInstance;

function renderChart(data, yoyGrowthData, newSubscribersMonthlyData, churnedSubscribersData) {
  const ctx = document.getElementById('subscriberChart').getContext('2d');

  if (subscriberChartInstance) {
    subscriberChartInstance.destroy();
  }

  subscriberChartInstance = new Chart(ctx, {
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
    const acquisitionGrowthRate = parseFloat(document.getElementById('acquisitionGrowth').value);
    const monthlyChurnRate = parseFloat(document.getElementById('churnReduction').value);
  
    const metrics = calculateMetrics(startingSubscribersCount, newSubscribersCountPerMonth, acquisitionGrowthRate, monthlyChurnRate);

    const totalSubscribersData = metrics.totalSubscribersArray;
    const yoyGrowthData = metrics.growthRatesArray;
    const newSubscribersMonthlyData = metrics.newSubscribersDataArray;
    const churnedSubscribersData = metrics.churnedSubscribersArray;
    
    renderChart(totalSubscribersData, yoyGrowthData, newSubscribersMonthlyData, churnedSubscribersData);
}

function updateBaselineData() {
    startingSubscribersCount = parseInt(document.getElementById('startingSubscribers').value);
    newSubscribersCountPerMonth = parseInt(document.getElementById('netNewSubscribers').value);
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