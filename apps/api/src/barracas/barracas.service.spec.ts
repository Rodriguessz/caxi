import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Barraca } from './barraca.entity';
import { BarracasService } from './barracas.service';

describe('BarracasService', () => {
  const repo = { findOne: jest.fn() } as unknown as jest.Mocked<Repository<Barraca>>;
  const service = new BarracasService(repo);

  it('retorna a barraca pelo slug', async () => {
    repo.findOne.mockResolvedValueOnce({ nome: 'Demo', slug: 'demo' } as Barraca);
    await expect(service.buscarPorSlug('demo')).resolves.toEqual({ nome: 'Demo', slug: 'demo' });
  });

  it('lança 404 quando o slug não existe', async () => {
    repo.findOne.mockResolvedValueOnce(null);
    await expect(service.buscarPorSlug('inexistente')).rejects.toBeInstanceOf(NotFoundException);
  });
});
