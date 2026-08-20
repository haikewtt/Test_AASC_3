export const jwtConfig = {
  secret: process.env.JWT_SECRET ?? 'aasc-game-secret-key',
  signOptions: { expiresIn: '24h' as const },
};
