import { Driver } from 'src/drivers/entities/driver.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Passenger, passenger => passenger.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    passenger: Passenger;

    @ManyToOne(() => Driver, driver => driver.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    driver: Driver;

    @Column('decimal')
    amount: number;

    @Column()
    date: Date
}