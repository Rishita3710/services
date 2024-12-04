document.getElementById('routeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const source = document.getElementById('source').value;
    const destinations = document.getElementById('destinations').value.split(',');
    const costPerKm = document.getElementById('costPerKm').value;

    const response = await fetch('/api/optimize-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destinations, costPerKm })
    });

    const result = await response.json();
    document.getElementById('result').innerHTML = `
      <h3>Optimal Route: ${result.route.join(' -> ')}</h3>
      <p>Total Distance: ${result.totalDistance} km</p>
      <p>Total Cost: ₹${result.totalCost}</p>
    `;
});
