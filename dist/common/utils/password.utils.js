"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.getPasswordStrengthScore = getPasswordStrengthScore;
const bcrypt = require("bcryptjs");
const DEFAULT_SALT_ROUNDS = 12;
async function hashPassword(plainTextPassword, saltRounds = DEFAULT_SALT_ROUNDS) {
    if (!plainTextPassword || plainTextPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(plainTextPassword, salt);
}
async function verifyPassword(plainTextPassword, hashedPassword) {
    if (!hashedPassword)
        return false;
    return bcrypt.compare(plainTextPassword, hashedPassword);
}
function getPasswordStrengthScore(password) {
    if (!password)
        return 0;
    let score = 0;
    if (password.length >= 8)
        score += 1;
    if (/[A-Z]/.test(password))
        score += 1;
    if (/[a-z]/.test(password))
        score += 1;
    if (/\d/.test(password))
        score += 1;
    if (/[^A-Za-z0-9]/.test(password))
        score += 1;
    return score;
}
//# sourceMappingURL=password.utils.js.map