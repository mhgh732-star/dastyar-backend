"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSocketConfig = void 0;
const loadSocketConfig = () => ({
    corsOrigins: (process.env.SOCKET_CORS || '').split(',').filter(Boolean),
    pingInterval: Number(process.env.SOCKET_PING_INTERVAL || 25000),
    pingTimeout: Number(process.env.SOCKET_PING_TIMEOUT || 60000),
});
exports.loadSocketConfig = loadSocketConfig;
//# sourceMappingURL=socket.config.js.map