import { MigrationInterface, QueryRunner } from 'typeorm';

// PR de evidência: a tabela "produtos" ainda não existe, então esta migration
// só funcionaria num banco montado à mão. O CI deve reprová-la.
export class AdicionaUnidadeProduto1761300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE produtos ADD COLUMN unidade varchar(10) NOT NULL DEFAULT 'un'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE produtos DROP COLUMN unidade`);
  }
}
