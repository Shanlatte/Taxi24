import { Driver } from '../../drivers/entities/driver.entity';
import { Location } from '../../locations/entities/location.entity';
import { Passenger } from '../../passengers/entities/passenger.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne } from 'typeorm';

@Entity()
export class Ride {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Passenger, passenger => passenger.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    passenger: Passenger;

    @ManyToOne(() => Driver, driver => driver.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    driver: Driver;

    @OneToOne(() => Location, location => location.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    startLocation: Location;

    @OneToOne(() => Location, location => location.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    endLocation: Location;

    @Column({ type: 'enum', enum: ['waiting', 'active', 'finished', 'cancelled'] })
    status: string;
}
