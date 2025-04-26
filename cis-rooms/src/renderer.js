document.addEventListener("DOMContentLoaded", () => {
  const statusHeader = document.getElementById("status");              // h1 (OPEN or IN USE)
  const nextEventTime = document.getElementById("next-event-time");    // h2 (NEXT EVENT)
  const currentEventName = document.getElementById("event-name");      // h2 (Event name)
  const eventStatus = document.getElementById("event-status");         // h2 (In Progress / Upcoming)
  const nextFreeTime = document.getElementById("next-free-time");      // h2 (Free at...)

  async function fetchAndUpdate() {
    try {
      const response = await fetch("https://cisrooms.stvincent.edu/pi/W211");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const now = new Date();

      // Find events that are either in progress or upcoming
      const relevantEvents = data
        .map(event => ({
          ...event,
          startDate: new Date(event.start),
          endDate: new Date(event.end)
        }))
        .filter(event => event.endDate > now)
        .sort((a, b) => a.startDate - b.startDate);

      if (relevantEvents.length === 0) {
        statusHeader.textContent = "O P E N";
        statusHeader.classList.remove("in-use");
        statusHeader.classList.add("open");

        nextEventTime.textContent = "No upcoming events";
        currentEventName.textContent = "";
        eventStatus.textContent = "";
        nextFreeTime.textContent = "";
        return;
      }

      const currentEvent = relevantEvents[0];
      const isOngoing = currentEvent.startDate <= now && currentEvent.endDate > now;
      const nextEvent = relevantEvents.find(event => event.startDate > now);

      // Update DOM with status and colors
      statusHeader.classList.remove("open", "in-use");

      if (isOngoing) {
        statusHeader.innerHTML = "I&nbsp;N&nbsp;-&nbsp;U&nbsp;S&nbsp;E";
        statusHeader.classList.add("in-use");
        eventStatus.textContent = "In Progress";
      } else {
        statusHeader.textContent = "O P E N";
        statusHeader.classList.add("open");
        eventStatus.textContent = "Upcoming Meeting";
      }

      currentEventName.textContent = currentEvent.name || "Event";

      if (nextEvent) {
        nextEventTime.textContent = `NEXT EVENT: ${nextEvent.startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
        nextFreeTime.textContent = `Free at ${currentEvent.endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
      } else {
        nextEventTime.textContent = "No more events today";
        nextFreeTime.textContent = `Free until end of day`;
      }

    } catch (error) {
      console.error("Fetch error:", error);
      currentEventName.textContent = "Error fetching data.";
    }
  }

  fetchAndUpdate();
  setInterval(fetchAndUpdate, 10000); // refresh every 10 seconds
});
