import { 
    Index, 
    Column, 
    Entity, 
    ManyToOne, 
    OneToMany, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Grade } from "src/grades/entities/grade.entity";
import { School } from "src/schools/entities/school.entity";
import { RegistryPoint } from "src/registry-points/entities/registry-point.entity";

@Entity()
@Index(['document', 'school'], { unique: true })
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    document: string;

    @Column()
    phone: string;

    @OneToMany(() => RegistryPoint, registryPoint => registryPoint.student)
    registryPoints: RegistryPoint[];

    @ManyToOne(() => Grade)
    grade: Grade;

    @ManyToOne(() => School)
    school: School;

    @Column({ default: 'ACTIVE' })
    isActive: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}
