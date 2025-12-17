import { 
    Column, 
    Entity, 
    OneToOne,
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "src/users/entities/user.entity";

@Entity()
export class School {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ unique: true })
    name: string;

    @Column({ default: 'ACTIVE' })
    isActive: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}
