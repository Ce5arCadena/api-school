import { FindOperator } from "typeorm"

interface QueryBase {
  school: {
    id: number
  },
  isActive: string,  
}

export interface GradeQuery extends QueryBase {
  name?: FindOperator<string>;
}

export interface SchoolQuery {
  isActive: string,  
  name?: FindOperator<string>;
}

export interface TeacherQuery extends QueryBase {
  phone?: FindOperator<string>;
  fullName?: FindOperator<string>;
  document?: FindOperator<string>;
}