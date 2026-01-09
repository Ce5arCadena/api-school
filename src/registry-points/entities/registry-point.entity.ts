import { Student } from "src/students/entities/student.entity";
import { PointCategory } from "src/point-categories/entities/point-category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    created: Date;
    
    @UpdateDateColumn()
    updated: Date;
}
