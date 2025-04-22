document.addEventListener("DOMContentLoaded", () => {
  const displayElement = document.getElementById("result");

  async function fetchAndUpdate() {
    try {
      const response = await fetch("https://cisrooms.stvincent.edu/pi/W211");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const nowUtc = new Date(); // Current time in local
      const now = new Date(nowUtc.toISOString()); // Convert to true UTC

      const upcomingRecord = data
        .filter(record => new Date(record.start) > now)
        .sort((a, b) => new Date(a.start) - new Date(b.start))[0];

      if (upcomingRecord) {
        displayElement.innerHTML = `
          <p><strong>Next Available:</strong> ${upcomingRecord.name}</p>
          <p><strong>Start:</strong> ${new Date(upcomingRecord.start).toLocaleString()}</p>
          <p><strong>End:</strong> ${new Date(upcomingRecord.end).toLocaleString()}</p>
        `;
      } else {
        displayElement.innerHTML = "<p>No upcoming records available.</p>";
      }
    } catch (error) {
      console.error("Fetch error:", error);
      displayElement.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
  }

  fetchAndUpdate(); // Initial fetch
  setInterval(fetchAndUpdate, 10000); // Update every 10 seconds
});
