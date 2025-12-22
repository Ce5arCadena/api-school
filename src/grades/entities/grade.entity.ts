import { 
    Index,
    Entity, 
    Column,  
    ManyToOne, 
    JoinColumn,
    ManyToMany,
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryGeneratedColumn,
} from "typeorm";
import { School } from "src/schools/entities/school.entity";
import { Teacher } from "src/teachers/entities/teacher.entity";

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

    @ManyToMany(() => Teacher, (teacher) => teacher.grades)
    // @JoinColumn()
    teachers: Teacher[];

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
