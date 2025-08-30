function getCurrentDateTime(date = new Date()) {
    const pad = (n) => n.toString().padStart(2, "0");

    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert to 12-hour format
    hours = pad(hours);

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Months are 0-indexed
    const year = date.getFullYear().toString().slice(-2); // Last 2 digits

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}

module.exports = getCurrentDateTime;
