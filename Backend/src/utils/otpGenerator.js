const crypto = require('crypto');

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate OTP expiry time (5 minutes from now)
 * @returns {Date} Expiry time
 */
const generateOTPExpiry = () => {
    return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
};

/**
 * Verify if OTP is valid and not expired
 * @param {string} userOTP - OTP entered by user
 * @param {string} storedOTP - OTP stored in database
 * @param {Date} expiryTime - OTP expiry time
 * @returns {boolean} true if valid, false otherwise
 */
const verifyOTP = (userOTP, storedOTP, expiryTime) => {
    if (!userOTP || !storedOTP || !expiryTime) {
        return false;
    }
    
    const isExpired = new Date() > new Date(expiryTime);
    const isMatching = userOTP.toString() === storedOTP.toString();
    
    return !isExpired && isMatching;
};

/**
 * Check if OTP can be resent (30 second cooldown)
 * @param {Date} lastSentTime - Last OTP sent time
 * @returns {boolean} true if can resend, false otherwise
 */
const canResendOTP = (lastSentTime) => {
    if (!lastSentTime) return true;
    
    const cooldownPeriod = 30 * 1000; // 30 seconds in milliseconds
    const timeSinceLastSent = Date.now() - new Date(lastSentTime).getTime();
    
    return timeSinceLastSent >= cooldownPeriod;
};

module.exports = {
    generateOTP,
    generateOTPExpiry,
    verifyOTP,
    canResendOTP
};
