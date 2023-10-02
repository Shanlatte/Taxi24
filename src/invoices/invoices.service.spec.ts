import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Driver } from 'src/drivers/entities/driver.entity';


const location: Location = { id: 1, latitude: 40, longitude: 50 };
const passenger: Passenger = { id: 1, person: { id: 2, name: 'person', email: 'person@gmail.com' } };
const driver: Driver = { id: 1, person: { id: 1, name: 'driver', email: 'driver@gmail.com' }, available: true, location };

const invoiceResult: Invoice[] = [{ id: 1, date: new Date(), amount: 50, ride: { id: 1, passenger, driver, startLocation: location, endLocation: location, status: 'finished' } }];

describe('InvoicesService', () => {
  let service: InvoicesService;
  let repository: Repository<Invoice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getRepositoryToken(Invoice),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    repository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const mockInvoices = invoiceResult;
      jest.spyOn(repository, 'find').mockResolvedValue(mockInvoices);

      expect(await service.findAll()).toBe(mockInvoices);
    });
  });

  describe('findOneById', () => {
    it('should return a single invoice by ID', async () => {
      const id = 1;
      const mockInvoice = invoiceResult[0];
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockInvoice);

      expect(await service.findOneById(id)).toBe(mockInvoice);
    });

    it('should throw NotFoundException if invoice with given ID is not found', async () => {
      const id = 99;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.findOneById(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('No invoice with this ID');
      }
    });
  });
});