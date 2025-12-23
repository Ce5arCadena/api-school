import { 
    Index, 
    Column, 
    Entity, 
    ManyToOne, 
    JoinColumn, 
    ManyToMany,
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Grade } from "src/grades/entities/grade.entity";
import { School } from "src/schools/entities/school.entity";

@Entity()
@Index(['fullName', 'school'], {unique: true})
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;
    
    @Column({ type: 'varchar', length: 12})
    document: string;

    @Column({ type: 'varchar', length: 10})
    phone: string;

    @ManyToMany(() => Grade, (grade) => grade.teachers)
    grades: Grade[];

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
