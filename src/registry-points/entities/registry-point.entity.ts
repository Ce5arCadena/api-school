import { School } from "src/schools/entities/school.entity";
import { Student } from "src/students/entities/student.entity";
import { PointCategory } from "src/point-categories/entities/point-category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Subject } from "src/subjects/entities/subject.entity";

@Entity()
export class RegistryPoint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    points: number;

    @ManyToOne(() => Student, (student) => student)
    student: Student;

    @ManyToOne(() => PointCategory, (pointCategory) => pointCategory.registryPoints)
    @JoinColumn()
    pointCategory: PointCategory;

    @ManyToOne(() => Subject)
    @JoinColumn()
    subject: Subject;

    @ManyToOne(() => School)
    school: School;

    @CreateDateColumn()
    created: Date;
    
    @UpdateDateColumn()
    updated: Date;
}
