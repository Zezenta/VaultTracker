var price;
async function getPrice(){
    const response = await fetch("https://blockchain.info/ticker");

    if (!response.ok) {
        console.log("Error al obtener precio de bitcoin")
    }

    const data = await response.json();
    price = data.USD.last;
}
const sats = 100000000;
/* DELETEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
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
*/
var user;
var prices;

const tableBody = document.getElementById('transaction-body'); //body del cuerpo de transacciones
var tableRow = document.getElementById("table-row"); //headers de la tabla de binance a la que se le puede añadir la etiqueta de dueño
const coldTable = document.getElementById('cold-wallet'); //tabla de retiros a frío

const saldoBinanceUsuarios = {};
const saldoFrioUsuarios = {};
const reservaDolares = {};



//create pie charts
(async() => {
    const userresponse = await fetch('/api/userdata');
    user = await userresponse.json();

    const pricesresponse = await fetch('/api/prices');
    prices = await pricesresponse.json();
    
    var top_section = document.getElementById("top_section");

    if(user.group){ //en caso de que sea un usuario en grupo
        top_section.classList.add("tgroup"); //this will be useful for media queries in mobile
        //modificar título de primer gráfico
        var title1 = document.getElementById("title1");
        title1.textContent = "Saldo Binance";
        //inicializar saldos de usuarios
        const owners = user.users;
        for (const persona of owners) {
            saldoBinanceUsuarios[persona] = 0; // Inicializa cada usuario con saldo 0
            saldoFrioUsuarios[persona] = 0;
            reservaDolares[persona] = 0;
        }

        await leerCompras(); //read purchases and create tables

        //añadir los 3 pie charts
        // Pie Chart de BITCOIN EN BINANCE
        const canvas1 = document.getElementById('pieChart1').getContext('2d');
        const pieChart = new Chart(canvas1, {
            type: 'doughnut',
            data: {
                labels: owners,
                datasets: [{
                    data: Object.values(saldoBinanceUsuarios).map(value => value / sats), //saca los valores del mapa saldoBinanceUsuarios y el .map itera sobre cada uno de ellos para modificarlos
                    backgroundColor: ['#FFD700', '#FF4500', '#1E90FF']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                // Mostrar el valor real en el tooltip
                                let valueBTC = context.raw;
                                let valueUSD = BTCtoUSD(context.raw, true);
                                return [
                                    `${valueBTC.toFixed(8)} BTC`,  // Primera línea (BTC)
                                    `$${valueUSD.toFixed(2)} USD`  // Segunda línea (USD)
                                ];
                            }
                        }
                    }
                }
            }
        });

        //crear parte del HTML de los otros 2 piecharts
        var chart_section = document.getElementById("chart_section");
        var pieChartDiv1 = document.getElementById("pie-div-1")
        pieChartDiv1.classList.remove("single");
        pieChartDiv1.classList.add("group");

        var pieChartDiv2 = document.createElement('div');
        pieChartDiv2.className = 'pie-chart';
        pieChartDiv2.classList.add("pie-chart", "group")
        var canvas2 = document.createElement('canvas');
        canvas2.id = "pieChart2";

        var title2 = document.createElement('h3');
        title2.className = 'chart-title';
        title2.textContent = 'BTC en Frío';
        pieChartDiv2.appendChild(title2);


        var pieChartDiv3 = document.createElement('div');
        pieChartDiv3.classList.add("pie-chart", "group")
        var canvas3 = document.createElement('canvas');
        canvas3.id = "pieChart3";

        var title3 = document.createElement('h3');
        title3.className = 'chart-title';
        title3.textContent = 'Reservas USD';
        pieChartDiv3.appendChild(title3);

        var reference = document.getElementById("balance_history");

        pieChartDiv2.appendChild(canvas2);
        pieChartDiv3.appendChild(canvas3);
        chart_section.insertBefore(pieChartDiv2);
        chart_section.insertBefore(pieChartDiv3);


        const pieCtx2 = document.getElementById('pieChart2').getContext('2d');
        const pieChart2 = new Chart(pieCtx2, {
            type: 'doughnut',
            data: {
                labels: owners,
                datasets: [{
                    data: Object.values(saldoFrioUsuarios).map(value => value / sats),
                    backgroundColor: ['#FFD700', '#FF4500', '#1E90FF']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                // Mostrar el valor real en el tooltip
                                let valueBTC = context.raw;
                                let valueUSD = BTCtoUSD(context.raw, true);
                                return [
                                    `${valueBTC.toFixed(8)} BTC`,  // Primera línea (BTC)
                                    `$${valueUSD.toFixed(2)} USD`  // Segunda línea (USD)
                                ];
                            }
                        }
                    }
                }
            }
        });

        const pieCtx3 = document.getElementById('pieChart3').getContext('2d');
        const pieChart3 = new Chart(pieCtx3, {
            type: 'doughnut',
            data: {
                labels: owners,
                datasets: [{
                    data: Object.values(reservaDolares),
                    backgroundColor: ['#FFD700', '#FF4500', '#1E90FF']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw}`
                            }
                        }
                    }
                }
            }
        });

        //COLUMNA DUEÑO en la tabla de transacciones
        var ownerColumn = document.createElement("th");
        ownerColumn.textContent = "DUEÑO";
        var montoTH = document.getElementById("table-monto-column");
        tableRow.insertBefore(ownerColumn, montoTH);

    }else{ //en caso de que sea un usuario individual
        top_section.classList.add("tsingle"); //media queries mobile
        //modificar el primer título
        var title1 = document.getElementById("title1");
        title1.textContent = user.name;

        //inicializar saldos del usuario
        saldoBinanceUsuarios[user.name] = 0;
        saldoFrioUsuarios[user.name] = 0;
        reservaDolares[user.name] = 0;

        await leerCompras();

        //único piechart
        const pieCtx = document.getElementById('pieChart1').getContext('2d');
        console.log(saldoBinanceUsuarios)
        console.log(saldoFrioUsuarios)
        console.log(reservaDolares)
        const pieChart = new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['BTC en Binance', 'BTC en Frío', 'Reservas USD'],
                datasets: [{
                    data: [
                        saldoBinanceUsuarios[user.name] /sats, 
                        saldoFrioUsuarios[user.name] /sats, 
                        reservaDolares[user.name] /sats
                    ],
                    backgroundColor: ['#FFD700', '#FF4500', '#1E90FF']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                // Mostrar el valor real en el tooltip
                                let valueBTC = context.raw;
                                let valueUSD = BTCtoUSD(context.raw, true);
                                return [
                                    `${valueBTC.toFixed(8)} BTC`,  // Primera línea (BTC)
                                    `$${valueUSD.toFixed(2)} USD`  // Segunda línea (USD)
                                ];
                            }
                        }
                    }
                }
            }
        });
    }




    // Balance History Chart
    var primeraComprafecha = new Date(user.compras[0].fecha); //when did the purchases start
    var currDate = new Date().toISOString().split('T')[0];

    function getSymmetricDates(startDate, endDate) { //get dates array for chart.js
        let dates = [];
        startDate.setDate(startDate.getDate() - 1);
        let currentDate = new Date(startDate);
        while (currentDate <= new Date(endDate)) {
            dates.push(currentDate.toISOString().split('T')[0]); // YYYY-MM-DD
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }
    var dateLabels = getSymmetricDates(primeraComprafecha, currDate);

    var btcBalance = 0; //for line chart
    var coldBTCBalance = 0; //for cold balance for line chart
    var btcData = []; //for chart.js

    //create the btcData array
    dateLabels.forEach(date => {
        const purchases = user.compras.filter(p => p.fecha === date); //get all purchases from each date

        for(const purchase of purchases){ //iterate through all of that day's purchases
            if(purchase.tipo === "binance"){
                btcBalance += purchase.cantidad; //if its a binance purchase, add that
            }else if(purchase.tipo === "cold"){
                btcBalance = purchase.cantidad + coldBTCBalance; //if its a cold withdrawal, just make that the new balance + what you have in cold
                coldBTCBalance += purchase.cantidad; // add that to the cold Balance
            }
        }
        btcData.push(btcBalance); //push that to the data
    });

    //get USD values depending on historical price
    function BTCbalanceToUSD(balanceBTC, startDate){
        let dataUSD = [];
        startDate.setDate(startDate.getDate() - 1);
        let currentDate = new Date(startDate);
        for(i = 0; i < dateLabels.length; i++){
            let dollarValue = prices[currentDate.toISOString().split('T')[0]] * balanceBTC[i];
            dataUSD.push(dollarValue);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dataUSD;
    }
    var usdData = BTCbalanceToUSD(btcData, primeraComprafecha);

    const balanceCtx = document.getElementById('balanceChart').getContext('2d');
    const balanceChart = new Chart(balanceCtx, {
        type: 'line',
        data: {
            labels: dateLabels, //LAS FECHAS IRÁN AQUÍ
            datasets: [
                {
                    label: 'BTC',
                    data: btcData.map(quant => quant / sats), //LOS BALANCES DE BTC IRÁN AQUÍ
                    borderColor: 'rgba(255, 215, 0)',
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',  //relleno transparente
                    tension: 0.3,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'USD',
                    data: usdData.map(quant => quant / sats), //LOS VALORES EN DÓLARES IRÁN AQUÍ
                    borderColor: 'rgba(50, 205, 50)',
                    backgroundColor: 'rgba(50, 205, 50, 0.2)',  //relleno transparente
                    tension: 0.3,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            elements: {
                point: {
                    radius: 0  //delete individual dots
                }
            },
            animation: false, //deactivate animations
            scales: {
                x: { 
                    ticks: { color: 'rgb(110, 112, 121)' } 
                },
                y: {
                    position: 'left',
                    ticks: { color: 'rgb(110, 112, 121)' },
                    title: {
                        display: true,
                        text: 'BTC Balance',
                        color: '#FFD700'
                    }
                },
                y1: {
                    position: 'right',
                    ticks: { color: 'rgb(110, 112, 121)' },
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
                },
                tooltip: {
                    callbacks: {
                        labelColor: function(context) {
                            return {
                                backgroundColor: context.dataset.borderColor,  //color sólido para el cuadradito del tooltip
                            }
                        },
                        label: function(tooltipItem) {
                            let value = tooltipItem.raw; 
                            // Verifica qué dataset se está mostrando en el tooltip
                            if (tooltipItem.dataset.label === 'BTC') {
                                return `${value.toFixed(8)} BTC`;
                            } else if (tooltipItem.dataset.label === 'USD') {
                                return `$${value.toFixed(2)}`;
                            }
                            return value;
                        }
                    }
                }
            }
        }
    });
})()




//añadir compras y transacciones a las tablas
//leer las transacciones del usuario
async function leerCompras(){
    await getPrice();
    //revertir las compras para que se muestren las más recientes primero FIX THIS URGENTLYURGENTLYURGENTLYURGENTLYURGENTLYURGENTLYURGENTLYURGENTLYURGENTLYURGENTLY
    for(let compra of user.compras){
        if(compra.tipo == "cold"){
            var valorActual = (compra.cantidad * price) / sats;
            var rendimiento = (valorActual - compra.monto) / compra.monto * 100;
            retiroFrio(compra.fecha, compra.cantidad/sats, valorActual.toFixed(2));

            //reiniciar el saldo frio de usuarios y añadir todo eso a la reserva en frío
            let sumaTotalBinance = 0; //obtener suma total de cuánto se retira
            for(const persona in saldoBinanceUsuarios) {
                sumaTotalBinance += saldoBinanceUsuarios[persona]; //obtener suma para luego saber cuánto le corresponde a cada uno
            }
            for(const persona in saldoFrioUsuarios){
                saldoFrioUsuarios[persona] += Math.floor((saldoBinanceUsuarios[persona] / sumaTotalBinance) * compra.cantidad); //llevar cuánto le corresponde a cada usuario a su valor en frío, descontando comisión de retiro
            }
            for(const persona in saldoBinanceUsuarios){
                saldoBinanceUsuarios[persona] = 0; //llevar el salario de binance a 0
            }
        }else{
            var valorActual = (compra.cantidad * price) / sats;
            var rendimiento = (valorActual - compra.monto) / compra.monto * 100;
            var precioCompra = compra.monto / (compra.cantidad/sats);
            var dueno = (user.group) ? compra.owner : user.name;
            agregarFila(compra.fecha, dueno, compra.monto, compra.cantidad/sats, Math.floor(precioCompra).toLocaleString(), valorActual.toFixed(2), rendimiento.toFixed(2));

            (user.group) ? saldoBinanceUsuarios[compra.owner] += compra.cantidad : saldoBinanceUsuarios[user.name] += compra.cantidad; //añadir la cantidad de compra dependiendo de si es usuario individual o grupo
        }
    }
}
//agregar filas a compras en binance
function agregarFila(date, owner, value, btcAmount, precioC, currentValue, change) {
    // Crea una nueva fila
    const nuevaFila = tableBody.insertRow(1);

    // Crea las celdas para la fila
    const celdaFecha = nuevaFila.insertCell();
    const celdaPropietario = (user.group) ? nuevaFila.insertCell() : undefined;
    const celdaValor = nuevaFila.insertCell();
    const celdaBtc = nuevaFila.insertCell();
    const celdaPrecioCompra = nuevaFila.insertCell();
    const celdaValorActual = nuevaFila.insertCell();
    const celdaRendimiento = nuevaFila.insertCell();
    var signoRendimiento = (change > 0) ? "+" : "";

    // Asigna los valores a cada celda
    celdaFecha.textContent = date;
    if (user.group) celdaPropietario.textContent = owner;
    celdaValor.textContent = `$${value}`;
    celdaBtc.textContent = `${btcAmount} BTC`;
    celdaPrecioCompra.textContent = `$${precioC}`;
    celdaValorActual.textContent = `$${currentValue}`;
    celdaRendimiento.textContent = `${signoRendimiento}${change}%`;

    const clase = change > 0 ? 'text-verde' : 'text-rojo';
    celdaValorActual.className = clase;
    celdaRendimiento.className = clase;
}

//agregar filas a los retiros en frío

function retiroFrio(date, cantidad, valorActual, change) {
    //para la tabla de Binance
    const nuevaFila = tableBody.insertRow(1);
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

    celdaFecha.textContent = date;
    celdaCantidad.textContent = `${cantidad} BTC`;
    celdaValor.textContent = `$${valorActual}`;
}

//convertir BTC a USD
function BTCtoUSD(BTC){
    return BTC * price;
}
