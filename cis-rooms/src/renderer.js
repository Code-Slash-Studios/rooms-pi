document.addEventListener("DOMContentLoaded", async () => {
  const displayElement = document.getElementById("result"); // Ensure an element exists in HTML
  let catFact = ""; // Variable to store the fetched data

  try {
    const response = await fetch("https://catfact.ninja/fact");
    const data = await response.json();
    catFact = data.fact; // Store the fact in the variable

    // Update the HTML
    displayElement.innerHTML = `<p>${catFact}</p>`;
  } catch (error) {
    console.error("Fetch error:", error);
    displayElement.innerHTML = `<p>Error fetching data</p>`;
  }
});
