import { Injectable, NotFoundException } from '@nestjs/common';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>,
  ) { }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find();
  }

  async findOne(id: number): Promise<Invoice> {

    const invoiceFound = await this.invoiceRepository.findOneBy({ id });

    if (!invoiceFound) {
      throw new NotFoundException('No invoice found with this id');
    }

    return invoiceFound;
  }
}
