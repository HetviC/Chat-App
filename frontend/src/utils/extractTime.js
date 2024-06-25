export function extractTime(dateString) {
    if (!dateString) return "now";  // Handle undefined or null input
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";  // Check if the date object is valid
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes}`;
}


// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
	return number.toString().padStart(2, "0");
}

