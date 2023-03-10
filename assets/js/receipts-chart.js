const chart = document.getElementById('chart');
const colorSet = ["#7FFFD4", "#8A2BE2"];

// Make color array same size as data
let colors = [];
for (let i = 0; i < chartDates.length; i++) {
    colors.push(colorSet[i % colorSet.length]);
}

// Using chart.js
new Chart(chart, {
    type: 'bar',
    data: {
        labels: chartDates,
        datasets: [{
            label: 'Tržba',
            data: chartAmounts,
            backgroundColor: colors,
        }]
    },
    options: {
        scales: {
            y: {
                display: false,
            }
        },
        legend: {
            display: false,
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    }
});