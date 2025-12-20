import { 
    Index,
    Entity, 
    Column,  
    ManyToOne, 
    JoinColumn,
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryGeneratedColumn,
} from "typeorm";
import { School } from "src/schools/entities/school.entity";

@Entity()
@Index(['name', 'school'], { unique: true })
export class Grade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        type: "varchar", 
        length: 70
    })
    name: string;

    @ManyToOne(() => School)
    @JoinColumn()
    school: School;

    @Column({ default: 'ACTIVE' })
    isActive: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}
