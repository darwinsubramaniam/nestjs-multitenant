import { Inject, Injectable } from '@nestjs/common';
import { Connection, QueryRunner, Repository, Table } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './cat.entity';
import { CONNECTION } from '../../tenancy/tenancy.symbols';

@Injectable()
export class CatsService {
  private readonly catsRepository: Repository<Cat>;

  constructor(
    // This is is not root user but user of this schema 
    @Inject(CONNECTION) connection: Connection,
  ) {
    this.catsRepository = connection.getRepository(Cat);
  }

  create(createCatDto: CreateCatDto): Promise<Cat> {
    const cat = new Cat();
    cat.name = createCatDto.name;

    // const queryRunner: QueryRunner =
    // this.catsRepository.manager.connection.createQueryRunner();
    // queryRunner.createSchema(this.catsRepository.metadata.schema);
    // const table = Table.create(this.catsRepository.metadata, this.catsRepository.manager.connection.driver);
    // queryRunner.createTable(table);
    return this.catsRepository.save(cat);
  }

  async findAll(): Promise<Cat[]> {
    return this.catsRepository.find();
  }
}
