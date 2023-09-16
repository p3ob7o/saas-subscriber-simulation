function calculateSubscribers(acquisitionGrowth, monthlyChurnRate) {
  const subscribers = [50000];
  let newSubscribers = 1500;

  for (let i = 1; i <= 60; i++) {
      newSubscribers += newSubscribers * (acquisitionGrowth / 100);
      let churningSubscribers = subscribers[i - 1] * (monthlyChurnRate / 100);
      subscribers[i] = subscribers[i - 1] + newSubscribers - churningSubscribers;
  }

  return subscribers;
}

function calculateBaselineSubscribers() {
  const subscribers = [50000];
  let newSubscribers = 1500;

  for (let i = 1; i <= 60; i++) {
      newSubscribers += newSubscribers * (1.5 / 100);
      let churningSubscribers = subscribers[i - 1] * (5 / 100);
      subscribers[i] = subscribers[i - 1] + newSubscribers - churningSubscribers;
  }

  return subscribers;
}

let subscriberChart;

function renderChart(data, baselineData) {
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
                  borderWidth: 1
              },
              {
                  label: 'Baseline',
                  data: baselineData,
                  borderColor: 'rgba(211, 211, 211, 1)',
                  borderWidth: 1,
                  pointRadius: 0
              }
          ]
      },
      options: {
          scales: {
              x: {
                  title: {
                      display: true,
                      text: 'Months'
                  },
                  beginAtZero: true
              },
              y: {
                  title: {
                      display: true,
                      text: 'Total Subscribers'
                  },
                  beginAtZero: true
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
  renderChart(newSubscribersData, baselineData);
}

document.getElementById('acquisitionGrowth').oninput = function() {
  document.getElementById('acquisitionOutput').textContent = parseFloat(this.value).toFixed(1);
}

document.getElementById('churnReduction').oninput = function() {
  document.getElementById('churnOutput').textContent = parseFloat(this.value).toFixed(1);
}

window.onload = () => {
  updateChart();
};
