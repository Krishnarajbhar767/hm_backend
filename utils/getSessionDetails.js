const requestIp = require("request-ip");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");

function getSessionDetails(req) {
    const ip = requestIp.getClientIp(req) || "Unknown IP";
    const geo = geoip.lookup(ip);
    const userAgent = req.headers["user-agent"] || "Unknown Agent";
    const parser = new UAParser(userAgent);
    const deviceInfo = parser.getResult();

    const location = geo
        ? `${geo.city || "City"}, ${geo.region || "Region"}, ${
              geo.country || "Country"
          }`
        : "Unknown Location";

    const browser = deviceInfo.browser.name
        ? `${deviceInfo.browser.name} ${deviceInfo.browser.version}`
        : "Unknown Browser";

    const os = deviceInfo.os.name
        ? `${deviceInfo.os.name} ${deviceInfo.os.version}`
        : "Unknown OS";

    const device = deviceInfo.device.type || "Desktop";

    return { ip, location, device, browser, os };
}

module.exports = getSessionDetails;
