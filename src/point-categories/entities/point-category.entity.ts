import { Grade } from "src/grades/entities/grade.entity";
import { School } from "src/schools/entities/school.entity";
import { Column, Entity, Index, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index()
export class PointCategory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: 'int'})
    maximunPoints: number;

    @OneToOne(() => Grade)
    grade: Grade;

    school: School;
}
