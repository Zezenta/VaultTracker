    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['usr1', 'usr2', 'usr3'],
        datasets: [{
          data: [40, 30, 30],
          backgroundColor: ['#FFD700', '#FF4500', '#1E90FF']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: '#fff' }
          }
        }
      }
    });

    // Balance History Chart
    const balanceCtx = document.getElementById('balanceChart').getContext('2d');
    const balanceChart = new Chart(balanceCtx, {
      type: 'line',
      data: {
        labels: ['7', '9', '13', '17', '21', '25', '2025'],
        datasets: [
          {
            label: 'BTC',
            data: [5.96, 5.97, 5.98, 5.99, 6.0, 6.01, 6.02],
            borderColor: '#FFD700',
            backgroundColor: 'rgba(255, 215, 0, 0.2)',
            tension: 0.3,
            fill: true,
            yAxisID: 'y'
          },
          {
            label: 'USD',
            data: [550, 580, 600, 620, 640, 660, 680],
            borderColor: '#32CD32',
            backgroundColor: 'rgba(50, 205, 50, 0.2)',
            tension: 0.3,
            fill: true,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { color: '#fff' } },
          y: {
            position: 'left',
            ticks: { color: '#fff' },
            title: {
              display: true,
              text: 'BTC Balance',
              color: '#FFD700'
            }
          },
          y1: {
            position: 'right',
            ticks: { color: '#32CD32' },
            title: {
              display: true,
              text: 'USD Value',
              color: '#32CD32'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#fff' }
          }
        }
      }
    });


(async () => { //daily report with complex charts
    try {
        const response = await fetch('/api/price'); // Llama al backend
        const data = await response.json();
        document.getElementById('price').textContent = `${data.USD.symbol} ${data.USD.last}`;
    } catch (error) {
        document.getElementById('price').textContent = 'Error al obtener precio';
    }
})();