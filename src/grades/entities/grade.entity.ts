import { 
    Index,
    Entity, 
    Column,  
    ManyToOne, 
    OneToMany,
    JoinColumn,
    ManyToMany,
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryGeneratedColumn,
} from "typeorm";
import { School } from "src/schools/entities/school.entity";
import { Teacher } from "src/teachers/entities/teacher.entity";
import { Student } from "src/students/entities/student.entity";

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

    // @ManyToMany(() => Teacher, (teacher) => teacher.grades)
    // teachers: Teacher[];

    @OneToMany(() => Student, (student) => student.grade)
    students: Student[];

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
