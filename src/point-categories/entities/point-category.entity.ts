import {
    Index, 
    Column, 
    Entity, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn,
} from "typeorm";
import { School } from "src/schools/entities/school.entity";
import { Subject } from "src/subjects/entities/subject.entity";
import { RegistryPoint } from "src/registry-points/entities/registry-point.entity";

@Entity()
@Index(['name', 'subject', 'school'], { unique: true })
export class PointCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'int' })
    maxPoints: number;

    @ManyToOne(() => Subject, (subject) => subject.pointCategories)
    subject: Subject;

    @OneToMany(() => RegistryPoint, (registryPoint) => registryPoint.pointCategory)
    registryPoints: RegistryPoint[];

    @Column({ default: 'ACTIVE'})
    isActive: string;

    @ManyToOne(() => School)
    school: School;
}
