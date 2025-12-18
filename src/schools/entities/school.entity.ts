import { 
    Column, 
    Entity, 
    OneToOne,
    JoinColumn, 
    PrimaryColumn,
    CreateDateColumn, 
    UpdateDateColumn,
} from "typeorm";
import { User } from "src/users/entities/user.entity";

@Entity()
export class School {
    @PrimaryColumn()
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
