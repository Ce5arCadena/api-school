import { Grade } from "src/grades/entities/grade.entity";
import { School } from "src/schools/entities/school.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;
    
    @Column({ type: 'varchar', length: '12'})
    document: number;

    @Column({ type: 'varchar', length: '10'})
    phone: number;

    @OneToOne(() => Grade)
    @JoinColumn()
    grade: Grade;

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
