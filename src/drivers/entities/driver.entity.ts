import { Location } from 'src/locations/entities/location.entity';
import { Person } from 'src/person/entities/person.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Driver {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Person, person => person.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    person: Person;

    @ManyToOne(() => Location, location => location.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    location: Person;

    @Column()
    available: boolean
}
