import { Person } from 'src/persons/entities/person.entity';
import { Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Passenger {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Person, person => person.id, { onDelete: 'SET NULL' })
    @JoinColumn()
    person: Person;
}
