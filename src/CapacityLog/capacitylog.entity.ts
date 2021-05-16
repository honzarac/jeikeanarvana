import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity()
export class CapacityLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    capacity: number;

    @CreateDateColumn()
    time: string;
}
