import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>,
  ) { }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceRepository.find({ relations: ['ride'] });
  }

  async findOneById(id: number): Promise<Invoice> {

    if (isNaN(id)) {
      throw new BadRequestException('Invalid id format');
    }
    
    const invoice: Invoice = await this.invoiceRepository.findOne({ where: { id }, relations: ['ride'] });

    if (!invoice) {
      throw new NotFoundException('No invoice with this ID')
    }

    return invoice;
  }
}
