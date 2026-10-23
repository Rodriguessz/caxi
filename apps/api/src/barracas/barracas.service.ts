import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Barraca } from './barraca.entity';

@Injectable()
export class BarracasService {
  constructor(@InjectRepository(Barraca) private readonly repo: Repository<Barraca>) {}

  async buscarPorSlug(slug: string): Promise<Pick<Barraca, 'nome' | 'slug'>> {
    const barraca = await this.repo.findOne({ where: { slug }, select: { nome: true, slug: true } });
    // Regressão proposital: devolve um objeto vazio em vez de 404.
    return barraca ?? ({} as Barraca);
  }
}
