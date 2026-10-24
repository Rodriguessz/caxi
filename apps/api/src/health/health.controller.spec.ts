import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  const health = { check: jest.fn() } as unknown as jest.Mocked<HealthCheckService>;
  const db = { pingCheck: jest.fn() } as unknown as jest.Mocked<TypeOrmHealthIndicator>;
  const controller = new HealthController(health, db);

  it('live responde sem depender do banco', () => {
    expect(controller.live()).toEqual({ status: 'ok' });
    expect(db.pingCheck).not.toHaveBeenCalled();
  });

  it('ready verifica o banco com timeout curto', async () => {
    health.check.mockImplementationOnce(async (indicators) => {
      await Promise.all(indicators.map((indicator) => indicator()));
      return { status: 'ok', details: {} };
    });
    await controller.ready();
    expect(db.pingCheck).toHaveBeenCalledWith('database', { timeout: 1500 });
  });
});
