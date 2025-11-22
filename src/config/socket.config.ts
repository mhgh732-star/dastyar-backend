export interface SocketConfig {
  corsOrigins: string[];
  pingInterval: number;
  pingTimeout: number;
}

export const loadSocketConfig = (): SocketConfig => ({
  corsOrigins: (process.env.SOCKET_CORS || '').split(',').filter(Boolean),
  pingInterval: Number(process.env.SOCKET_PING_INTERVAL || 25_000),
  pingTimeout: Number(process.env.SOCKET_PING_TIMEOUT || 60_000),
});
