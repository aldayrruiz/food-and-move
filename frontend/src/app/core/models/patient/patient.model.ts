export interface PatientModel {
  _id: string;
  name: string;
  surname?: string;
  email: string;
  password: string;
  phone?: string;
  birth?: Date;
  height?: number;
  profile_image?: string;
  employees: string[];
}
