import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Driver } from 'src/drivers/entities/driver.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Invoice } from './entities/invoice.entity';

const location: Location = { id: 1, latitude: 40, longitude: 50 };
const passenger: Passenger = { id: 1, person: { id: 2, name: 'person', email: 'person@gmail.com' } };
const driver: Driver = { id: 1, person: { id: 1, name: 'driver', email: 'driver@gmail.com' }, available: true, location };

const invoiceResult: Invoice[] = [{ id: 1, date: new Date(), amount: 50, ride: { id: 1, passenger, driver, startLocation: location, endLocation: location, status: 'finished' } }];

class InvoiceServiceMock {
  findAll() {
    return invoiceResult;
  }

  findOneById() {
    return invoiceResult[0];
  }
}

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useClass: InvoiceServiceMock,
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const result = invoiceResult;
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOneById', () => {
    it('should return a single invoice by ID', async () => {
      const id = '1';
      jest.spyOn(service, 'findOneById').mockResolvedValue(invoiceResult[0]);

      expect(await controller.findOneById(id)).toBe(invoiceResult[0]);
    });
  });
});