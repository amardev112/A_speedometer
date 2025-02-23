let currentSpeed = 0; // Displayed speed
let targetSpeed = 0; // Speed from event data

window.addEventListener('message', function(event) {
    let data = event.data;

    // Ensure the speedometer is only visible when inCar is true
    if (data.inCar) {
        document.body.classList.add("in-car");
    } else {
        document.body.classList.remove("in-car");
    }

    // Smooth speed update
    targetSpeed = data.speed || 0; // Get new speed value

    let speedElement = document.getElementById('speed');
    if (speedElement) {
        updateSpeed();
    }

    // Check if elements exist before updating to avoid errors
    let fuelElement = document.getElementById('fuel');
    if (fuelElement) {
        fuelElement.classList.toggle('active', data.fuel > 0);
        document.documentElement.style.setProperty('--fuel-level', `${data.fuel}%`);
    }

    let engineElement = document.getElementById('engine');
    if (engineElement) {
        engineElement.classList.toggle('active', data.engine);
    }

    let beltElement = document.getElementById('belt');
    if (beltElement) {
        beltElement.classList.toggle('active', data.belt);
    }
});

// Function to update speed smoothly
function updateSpeed() {
    if (currentSpeed < targetSpeed) {
        currentSpeed += Math.min(1, targetSpeed - currentSpeed); // Increase smoothly
    } else if (currentSpeed > targetSpeed) {
        currentSpeed -= Math.min(1, currentSpeed - targetSpeed); // Decrease smoothly
    }

    let speedElement = document.getElementById('speed');
    if (speedElement) {
        speedElement.innerText = currentSpeed; // Update displayed speed
    }

    // Add fast vertical shaking effect if speed is over 150
    if (currentSpeed > 150) {
        speedElement.style.animation = "shake 0.1s infinite alternate";
    } else {
        speedElement.style.animation = "none";
    }

    if (currentSpeed !== targetSpeed) {
        setTimeout(updateSpeed, 50); // Update every 50ms for smooth transition
    }
}

// Add CSS for shake effect
document.head.insertAdjacentHTML("beforeend", `
    <style>
    @keyframes shake {
        0% { transform: translateY(-2px); }
        100% { transform: translateY(2px); }
    }
    </style>
`);
