import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTenantConnection } from '../../tenancy/tenancy.utils';
import { getManager, Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { Tenant } from './tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    let tenant = new Tenant();
    tenant.name = createTenantDto.name;

    tenant = await this.tenantsRepository.save(tenant);

    const schemaName = `tenant_${tenant.id}`;
    // Start As Root USer
    await getManager().query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    // -  creating the user for the schema and grant the user access to the the schema 

    const connection = await getTenantConnection(`${tenant.id}`);
    await connection.runMigrations()
    await connection.close();

    // Exit the root user

    return tenant 
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantsRepository.find();
  }
}
