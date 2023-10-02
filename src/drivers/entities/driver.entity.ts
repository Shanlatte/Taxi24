import { Location } from '../../locations/entities/location.entity';
import { Person } from '../../persons/entities/person.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Person, person => person.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    person: Person;

    @OneToOne(() => Location, location => location.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    location: Location;

    @Column()
    available: boolean
}
