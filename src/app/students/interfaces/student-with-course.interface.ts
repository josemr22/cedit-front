// Generated by https://quicktype.io

import { User } from 'src/app/users/interfaces/user.interface';

export interface StudentWithCourse {
  id: number;
  student_id: number;
  course_turn_id: number;
  enrolled_by: number;
  payment_id: number;
  start_date: string;
  created_at: string;
  updated_at: string;
  course_turn: CourseTurn;
  student: Student;
  matriculator: User;
  label?: string;
}

export interface CourseTurn {
  id: number;
  course_id: number;
  turn_id: number;
  start_hour: string;
  end_hour: string;
  days: string;
  created_at: string;
  updated_at: string;
  course: Course;
  turn: Course;
}

export interface Course {
  id: number;
  name: string;
  days?: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: number;
  name: string;
  dni: string;
  email: string;
  department_id: number;
  address: string;
  phone: string;
  cellphone: string;
  date_of_birth: string;
  observation: string;
  registered_by: number;
  course_id: number;
  course_turn_id: number;
  created_at: string;
  updated_at: string;
  department: Course;
}