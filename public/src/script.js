function calculateSubscribers(acquisitionGrowth, churnReduction) {
    const subscribers = [50000];
    let newSubscribers = 1500;
    let churningSubscribers = 1500;
  
    for (let i = 1; i <= 36; i++) {
      newSubscribers += newSubscribers * (acquisitionGrowth / 100);
      churningSubscribers -= churningSubscribers * (churnReduction / 100);
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
      labels: [...Array(37).keys()],
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
    document.getElementById('acquisitionOutput').value = this.value;
}

document.getElementById('churnReduction').oninput = function() {
    document.getElementById('churnOutput').value = this.value;
}

  
  window.onload = () => {
    updateChart();
  };