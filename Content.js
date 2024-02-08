// content.js

console.log("Content script loaded");

function convertMinutesToTime(minutes) {
  if (parseInt(minutes) === 0) {
    return "now"; // Return "now" if the content is 0
  } else {
    const now = new Date();
    const totalMinutes = now.getMinutes() + parseInt(minutes.replace("'", ""));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${(now.getHours() + hours) % 24}:${mins.toString().padStart(2, '0')}`;
  }
}

function processElements(elements) {
  elements.forEach(span => {
    const times = span.textContent.split(', ').map(min => {
      const number = parseInt(min.replace("'", ""));
      return convertMinutesToTime(min);
    });
    const realTime = times.filter(time => typeof time === 'string');
    
    let existingArrivalsAtSpan = span.parentNode.querySelector('.arrivalsAt');
    if (existingArrivalsAtSpan) {
      // Update the existing arrivalsAt span with the new times
      existingArrivalsAtSpan.textContent = `Arrival at ${realTime.join(', ')}`; // Add "Arrival at" before the real time
    } else {
      // Create a new arrivalsAt span if it doesn't exist
      existingArrivalsAtSpan = document.createElement('span');
      existingArrivalsAtSpan.className = 'arrivalsAt';
      existingArrivalsAtSpan.textContent = `Arrival at ${realTime.join(', ')}`; // Add "Arrival at" before the real time
      const br = document.createElement('br');
      span.parentNode.insertBefore(existingArrivalsAtSpan, span.nextSibling);
      span.parentNode.insertBefore(br, span.nextSibling);
    }
  });
}


function executeWhenDisplayed() {
  const arrivalContainers = document.querySelectorAll('.list-group-item.arrivalContainer');
  arrivalContainers.forEach(container => {
    if (container.style.display === 'block') {
      const elements = container.querySelectorAll('.arrivalsAr');
      processElements(elements);
    }
  });
}

// Polling function to check for changes in the element
function pollElement() {
  executeWhenDisplayed(); // Execute the script
}

// Poll every 100 milliseconds
setInterval(pollElement, 1000);