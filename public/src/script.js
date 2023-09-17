let startingSubscribers = 50000;
let newSubscribersPerMonth = 1500;
let initialMonthlyChurnRate = 5;

function calculateSubscribers(acquisitionGrowth, monthlyChurnRate) {
  const subscribers = [startingSubscribers];
  let newSubscribers = newSubscribersPerMonth;

  for (let i = 1; i <= 60; i++) {
      newSubscribers += newSubscribers * (acquisitionGrowth / 100);
      let churningSubscribers = subscribers[i - 1] * (monthlyChurnRate / 100);
      subscribers[i] = subscribers[i - 1] + newSubscribers - churningSubscribers;
  }

  return subscribers;
}

function calculateBaselineSubscribers() {
  const subscribers = [startingSubscribers];
  let newSubscribers = newSubscribersPerMonth;

  for (let i = 1; i <= 60; i++) {
      let churningSubscribers = subscribers[i - 1] * (initialMonthlyChurnRate / 100);
      subscribers[i] = subscribers[i - 1] + newSubscribers - churningSubscribers;
  }

  return subscribers;
}

function calculateYearOverYearGrowth(subscribers) {
  const growthRates = [null, null, null, null, null, null, null, null, null, null, null, null];
  for (let i = 12; i < subscribers.length; i++) {
    growthRates[i] = ((subscribers[i] / subscribers[i - 12]) - 1) * 100;
  }
  return growthRates;
}

let subscriberChart;

function renderChart(data, baselineData, yoyGrowthData) {
  const ctx = document.getElementById('subscriberChart').getContext('2d');

  if (subscriberChart) {
      subscriberChart.destroy();
  }

  subscriberChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: [...Array(61).keys()].map(x => x + ' months'),
          datasets: [
              {
                  label: 'Number of Subscribers',
                  data: data,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                  yAxisID: 'y',
              },
              {
                  label: 'Baseline',
                  data: baselineData,
                  borderColor: 'rgba(211, 211, 211, 1)',
                  borderWidth: 1,
                  pointRadius: 0,
                  yAxisID: 'y',
              },
              {
                  label: 'Year-over-Year Growth Rate (%)',
                  data: yoyGrowthData,
                  borderColor: 'rgba(255, 165, 0, 1)',
                  borderWidth: 1,
                  pointRadius: 0,
                  yAxisID: 'y1',
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
                          family: 'monospace'
                      }
                  },
                  beginAtZero: true,
                  ticks: {
                      font: {
                          family: 'monospace'
                      }
                  }
              },
              y: {
                  title: {
                      display: true,
                      text: 'Total Subscribers',
                      font: {
                          family: 'monospace'
                      }
                  },
                  min: 0,
                  max: 500000,
                  beginAtZero: true,
                  ticks: {
                      font: {
                          family: 'monospace'
                      }
                  }
              },
              y1: {
                  type: 'linear',
                  position: 'right',
                  title: {
                      display: true,
                      text: 'Growth Rate (%)',
                      font: {
                          family: 'monospace'
                      }
                  },
                  beginAtZero: false,
                  min: -20,
                  max: 80,
                  grid: {
                      drawOnChartArea: false,
                  },
                  ticks: {
                      font: {
                          family: 'monospace'
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
  
    const newSubscribersData = calculateSubscribers(acquisitionGrowth, monthlyChurnRate);
    const baselineData = calculateBaselineSubscribers();
    const yoyGrowthData = calculateYearOverYearGrowth(newSubscribersData);
  
    renderChart(newSubscribersData, baselineData, yoyGrowthData, startingSubscribers);
}

function updateBaselineData() {
    startingSubscribers = parseInt(document.getElementById('startingSubscribers').value);
    newSubscribersPerMonth = parseInt(document.getElementById('netNewSubscribers').value);
    initialMonthlyChurnRate = parseFloat(document.getElementById('initialMonthlyChurn').value);
  
    document.getElementById('baselineDataList').innerHTML = `
      <li>${startingSubscribers} subscribers at starting point.</li>
      <li>${newSubscribersPerMonth} net new subscribers per month.</li>
      <li>${initialMonthlyChurnRate}% monthly churn.</li>
    `;
  
    updateChart();
}

document.getElementById('acquisitionGrowth').oninput = function() {
  document.getElementById('acquisitionOutput').textContent = parseFloat(this.value).toFixed(1);
  updateChart();
  if (this.value > 3) {
    this.classList.add('bg-red-500');
  } else {
    this.classList.remove('bg-red-500');
  }
}

document.getElementById('churnReduction').oninput = function() {
  document.getElementById('churnOutput').textContent = parseFloat(this.value).toFixed(1);
  updateChart();
  if (this.value < 2) {
    this.classList.add('bg-red-500');
  } else {
    this.classList.remove('bg-red-500');
  }
}

window.onload = () => {
  updateChart();
};
