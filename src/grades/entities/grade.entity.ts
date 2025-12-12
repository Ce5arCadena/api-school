import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Grade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ 
        type: "varchar", 
        length: 70
    })
    name: string;

    @Column({ default: 'ACTIVE' })
    isActive: string;

    @CreateDateColumn()
    created: Date;

    @UpdateDateColumn()
    updated: Date;
}
