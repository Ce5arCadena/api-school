import { Exclude } from "class-transformer";
import { 
    Index, 
    Column, 
    Entity, 
    OneToOne, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryGeneratedColumn, 
} from "typeorm";
import { School } from "src/schools/entities/school.entity";

export enum UserRole {
    SCHOOL = 'SCHOOL',
    STUDENT = 'STUDENT',
    TEACHER = 'TEACHER',
    SUPERADMIN = 'SUPERADMIN',
};

@Entity()
@Index(['email', 'school'], { unique: true })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.TEACHER
    })
    rol: string;

    @OneToOne(() => School, { nullable: true })
    @JoinColumn()
    school: School;

    @Column({ default: 'ACTIVE' })
    isActive: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}
