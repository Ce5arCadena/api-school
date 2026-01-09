import { Grade } from "src/grades/entities/grade.entity";
import { School } from "src/schools/entities/school.entity";
import { Teacher } from "src/teachers/entities/teacher.entity";
import { 
    Index, 
    Column, 
    Entity, 
    ManyToOne, 
    JoinColumn, 
    UpdateDateColumn, 
    CreateDateColumn, 
    PrimaryGeneratedColumn, 
} from "typeorm";

@Entity()
@Index(['name', 'school'], { unique: true })
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => School)
    school: School;

    @ManyToOne(() => Grade)
    @JoinColumn()
    grade: Grade;

    @ManyToOne(() => Teacher)
    @JoinColumn()
    teacher: Teacher;

    @Column({ default: 'ACTIVE'})
    isActive: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}
