import { 
    Index, 
    Column, 
    Entity, 
    ManyToOne, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn, 
} from "typeorm";
import { Grade } from "src/grades/entities/grade.entity";
import { School } from "src/schools/entities/school.entity";

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
