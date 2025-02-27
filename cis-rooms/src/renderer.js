document.addEventListener("DOMContentLoaded", () => {
  const displayElement = document.getElementById("result");

  async function fetchAndUpdate() {
    try {
      const response = await fetch("https://catfact.ninja/fact");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      displayElement.innerHTML = `<p>${data.fact}</p>`;
    } catch (error) {
      console.error("Fetch error:", error);
      displayElement.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
  }

  fetchAndUpdate(); // Fetch immediately on load

  setInterval(fetchAndUpdate, 10000); // Update every 10 seconds
});
