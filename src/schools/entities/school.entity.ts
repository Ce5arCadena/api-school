import { Exclude } from "class-transformer";
import { 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn, 
} from "typeorm";

@Entity()
export class School {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ default: 'ACTIVE' })
    isActive: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}
