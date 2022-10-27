import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsuarios1656685284937 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        // Tabela é um objeto
        name: 'usuarios', // Nova tabela chamada Servidores
        columns: [
          // Array dos atributos dessa tabela
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true, // ID é a chave primária
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false, // Não pode ser nulo (Padrão se deixar sem)
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false, // Não pode ser nulo (Padrão se deixar sem)
          },
          {
            name: 'role',
            type: 'varchar',
            isNullable: false, // Não pode ser nulo (Padrão se deixar sem)
          },
          {
            name: 'sector',
            type: 'varchar',
            isNullable: false, // Não pode ser nulo (Padrão se deixar sem)
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false, // Não pode ser nulo (Padrão se deixar sem)
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()', // Banco de dados captura data e tempo do momento
          },
          {
            name: 'update_at',
            type: 'timestamp',
            default: 'now()', // Banco de dados captura data e tempo do momento
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuarios');
  }
}
