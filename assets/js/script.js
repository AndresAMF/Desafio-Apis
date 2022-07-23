const result = document.querySelector(".total");
const btn = document.querySelector(".convert");
let myCanvas = document.querySelector(".canvas").getContext("2d");
let myChart;

btn.addEventListener("click", () => {
  const selectedCoin = document.querySelector(".coinSelector").value;

  if (selectedCoin == "Selecciona moneda") {
    alert("Por favor selecciona una moneda de cambio");
  } else {
    fetchData(selectedCoin);
  }
});

const fetchData = async (coin) => {
  try {
    const results = await fetch(`https://mindicador.cl/api/${coin}`);
    const data = await results.json();
    const value = data.serie[0].valor;
    const hist_10days = data.serie.splice(0, 10);
    convert(value, coin);
    setData(hist_10days);
  } catch (error) {
    console.log(error);
  }
};

const convert = (value, coin) => {
  const myInput = document.querySelector(".inputCoin").value;
  let operation;
  let results;

  if (myInput == 0 || myInput == undefined || myInput == NaN) {
    alert("Por favor ingresar cantidad valida en CLP");
  } else {
    if (coin == "dolar") {
      operation = parseInt(myInput) / parseInt(value);
      results = `USD$ ${operation.toFixed(2)}`;
    } else if (coin == "euro") {
      operation = parseInt(myInput) / parseInt(value);
      results = `EUR$ ${operation.toFixed(2)}`;
    } else if (coin == "uf") {
      operation = parseInt(myInput) / parseInt(value);
      results = `UF$ ${operation.toFixed(2)}`;
    }

    result.innerHTML = results;
  }
};

const setData = (hist_10days) => {
  const sortedData = hist_10days.sort((x, y) => {
    if (x.fecha < y.fecha) {
      return -1;
    }
    if (x.fecha > y.fecha) {
      return 1;
    }
    return 0;
  });

  const dates = sortedData.map((x) => dateFormat(x.fecha));
  const values = sortedData.map((x) => x.valor);
  createGraph(values, dates);
};

const dateFormat = (date) => {
  date = new Date(date);
  const año = date.getFullYear();
  const meses = date.getMonth() + 1;
  const dias = date.getDate();
  return `${año}-${meses}-${dias}`;
};

const createGraph = (values, dates) => {
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(myCanvas, {
    type: "line",
    data: {
      labels: dates,
      datasets: [
        {
          label: `Valores en los últimos 10 días`,
          data: values,
          borderColor: "rgb(0, 0, 110)",
        },
      ],
    },
  });
};
