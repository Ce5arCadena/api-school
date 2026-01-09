import { 
    Index, 
    Column, 
    Entity, 
    ManyToOne, 
    OneToMany, 
    JoinColumn, 
    UpdateDateColumn, 
    CreateDateColumn, 
    PrimaryGeneratedColumn,
} from "typeorm";
import { Grade } from "src/grades/entities/grade.entity";
import { School } from "src/schools/entities/school.entity";
import { Teacher } from "src/teachers/entities/teacher.entity";
import { PointCategory } from "src/point-categories/entities/point-category.entity";

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

    @OneToMany(() => PointCategory, (pointCategory) => pointCategory.subject)
    pointCategories: PointCategory[];

    @Column({ default: 'ACTIVE'})
    isActive: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}
