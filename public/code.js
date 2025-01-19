var price = 0;
const sats = 100000000;
(async () => { //daily report with complex charts
    try {
        const response = await fetch('/api/bitcoin');
        const data = await response.json();
        document.getElementById('price').textContent = `${data.USD.symbol} ${data.USD.last}`;
        price = data.USD.last;
    } catch (error) {
        document.getElementById('price').textContent = 'Error al obtener precio';
    }
})();

var data;
document.addEventListener('DOMContentLoaded', async function() {
    const response = await fetch('/api/userdata');
    data = await response.json();
    leerCompras();
});

const userData = JSON.parse(localStorage.getItem('userData'));

// Pie Chart
const pieCtx = document.getElementById('pieChart1').getContext('2d');
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

if(2+2 == 4){
    var top_section = document.getElementById("top_section");
    var pieChartDiv1 = document.getElementById("pie-div-1")
    pieChartDiv1.classList.remove("single");
    pieChartDiv1.classList.add("group");

    var pieChartDiv2 = document.createElement('div');
    pieChartDiv2.className = 'pie-chart';
    pieChartDiv2.classList.add("pie-chart", "group")
    var canvas2 = document.createElement('canvas');
    canvas2.id = "pieChart2";

    var pieChartDiv3 = document.createElement('div');
    pieChartDiv3.classList.add("pie-chart", "group")
    var canvas3 = document.createElement('canvas');
    canvas3.id = "pieChart3";

    var reference = document.getElementById("balance_history");

    pieChartDiv2.appendChild(canvas2);
    pieChartDiv3.appendChild(canvas3);
    top_section.insertBefore(pieChartDiv2, reference);
    top_section.insertBefore(pieChartDiv3, reference);


    const pieCtx2 = document.getElementById('pieChart2').getContext('2d');
    const pieChart2 = new Chart(pieCtx2, {
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

    const pieCtx3 = document.getElementById('pieChart3').getContext('2d');
    const pieChart3 = new Chart(pieCtx3, {
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
}

// Función para crear un canvas para el gráfico
function crearPieChart(id, dataSet) {
    // Crear un contenedor div y un canvas
    const pieChartDiv = document.createElement('div');
    pieChartDiv.className = 'pie-chart';
    const canvas = document.createElement('canvas');
    canvas.id = id;
  
    // Agregar el canvas al div
    pieChartDiv.appendChild(canvas);
    topSection.appendChild(pieChartDiv);
  
    // Crear el gráfico usando Chart.js
    new Chart(canvas.getContext('2d'), {
      type: 'pie',
      data: {
        labels: dataSet.labels,
        datasets: [{
          data: dataSet.data,
          backgroundColor: dataSet.backgroundColors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
}

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

// Obtén el cuerpo de la tabla donde se agregarán las nuevas filas
const tableBody = document.getElementById('transaction-body');

// Función para agregar una fila a la tabla
function agregarFila(date, owner, value, btcAmount, precioC, currentValue, change) {
  // Crea una nueva fila
  const nuevaFila = tableBody.insertRow();

  // Crea las celdas para la fila
  const celdaFecha = nuevaFila.insertCell();
  const celdaPropietario = nuevaFila.insertCell();
  const celdaValor = nuevaFila.insertCell();
  const celdaBtc = nuevaFila.insertCell();
  const celdaPrecioCompra = nuevaFila.insertCell();
  const celdaValorActual = nuevaFila.insertCell();
  const celdaRendimiento = nuevaFila.insertCell();
  var signoRendimiento = (change > 0) ? "+" : "";

  // Asigna los valores a cada celda
  celdaFecha.textContent = date;
  celdaPropietario.textContent = owner;
  celdaValor.textContent = `$${value}`;
  celdaBtc.textContent = `${btcAmount} BTC`;
  celdaPrecioCompra.textContent = `$${precioC}`;
  celdaValorActual.textContent = `$${currentValue}`;
  celdaRendimiento.textContent = `${signoRendimiento}${change}%`;

  const clase = change > 0 ? 'text-verde' : 'text-rojo';
  celdaValorActual.className = clase;
  celdaRendimiento.className = clase;
}

const coldTable = document.getElementById('cold-wallet');

// Función para agregar una fila a la tabla
function retiroFrio(date, cantidad, valorActual, change) {
    //para la tabla de Binance
    const nuevaFila = tableBody.insertRow();
    const celdaFechaBi = nuevaFila.insertCell()
    const celdaTextoBi = nuevaFila.insertCell();

    celdaTextoBi.textContent = "RETIRO A CARTERA EN FRÍO";
    celdaFechaBi.textContent = date;
    celdaTextoBi.className = "cold";
    celdaTextoBi.colSpan = 7;

    //tabla en frío
    const nuevaFilaCold = coldTable.insertRow();
    const celdaFecha = nuevaFilaCold.insertCell();
    const celdaCantidad = nuevaFilaCold.insertCell();
    const celdaValor = nuevaFilaCold.insertCell();
    //const celdaRendimiento = nuevaFilaCold.insertCell();
    //var signoRendimiento = (change > 0) ? "+" : "";

    celdaFecha.textContent = date;
    celdaCantidad.textContent = `${cantidad} BTC`;
    celdaValor.textContent = `$${valorActual}`;
    //celdaRendimiento.textContent = `${signoRendimiento}${change}%`;

    //const clase = change > 0 ? 'text-verde' : 'text-rojo';
    //celdaValor.className = clase;
    //celdaRendimiento.className = clase;
}



//const userData = users[1];

function leerCompras(){
    for(let compra of user.compras){
        if(compra.tipo == "cold"){
            var valorActual = (compra.cantidad * price) / sats;
            var rendimiento = (valorActual - compra.monto) / compra.monto * 100;
            retiroFrio(compra.fecha, compra.cantidad/sats, valorActual.toFixed(2));
        }else{
            var valorActual = (compra.cantidad * price) / sats;
            var rendimiento = (valorActual - compra.monto) / compra.monto * 100;
            var precioCompra = compra.monto / (compra.cantidad/sats);
            agregarFila(compra.fecha, compra.owner, compra.monto, compra.cantidad/sats, Math.floor(precioCompra).toLocaleString(), valorActual.toFixed(2), rendimiento.toFixed(2));
        }
    }
}
console.log(userData.username);