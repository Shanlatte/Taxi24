import { Ride } from '../../rides/entities/ride.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Ride, ride => ride.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    ride: Ride;

    @Column('decimal')
    amount: number;

    @Column()
    date: Date
}