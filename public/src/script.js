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

let subscriberChart;

function renderChart(data) {
  const ctx = document.getElementById('subscriberChart').getContext('2d');

  if (subscriberChart) {
      subscriberChart.destroy();
  }

  subscriberChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: [...Array(61).keys()],
          datasets: [{
              label: 'Number of Subscribers',
              data: data,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              x: {
                  beginAtZero: true
              },
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}

function updateChart() {
  const acquisitionGrowth = parseFloat(document.getElementById('acquisitionGrowth').value);
  const churnReduction = parseFloat(document.getElementById('churnReduction').value);

  const newSubscribersData = calculateSubscribers(acquisitionGrowth, churnReduction);
  renderChart(newSubscribersData);
}

document.getElementById('acquisitionGrowth').oninput = function() {
  document.getElementById('acquisitionOutput').textContent = this.value;
}

document.getElementById('churnReduction').oninput = function() {
  document.getElementById('churnOutput').textContent = this.value;
}

window.onload = () => {
  updateChart();
};
