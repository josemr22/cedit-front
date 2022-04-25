// Generated by https://quicktype.io

export interface Installment {
  id: number;
  number: null;
  type: string;
  amount: number;
  balance: number;
  late: number;
  observation: null;
  payment_id: number;
  created_at: string;
  updated_at: string;
  payment: Payment;
  mora: number;
}

export interface Payment {
  id: number;
  amount: number;
  type: number;
  observation: null;
  transaction_id: null;
  created_at: string;
  updated_at: string;
  course_turn_student: CourseTurnStudent;
  sale: Sale | null;
}

export interface Seller {
  id: number;
  name: string;
  user: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: number;
  state: number;
  type: string;
  payment_id: number;
  course_turn_student_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  seller: Seller;
  course_turn_student: CourseTurnStudent;
}

export interface CourseTurnStudent {
  id: number;
  student_id: number;
  course_turn_id: number;
  enrolled_by: number;
  payment_id: number;
  start_date: string;
  created_at: string;
  updated_at: string;
  student: Student;
  course_turn: CourseTurn;
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
  turn: Turn;
}

export interface Course {
  id: number;
  name: string;
  days: string;
  created_at: string;
  updated_at: string;
}

export interface Turn {
  id: number;
  name: string;
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
}
