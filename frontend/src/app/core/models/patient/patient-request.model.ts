export interface PatientRequestModel {
  name: string;
  surname?: string;
  email: string;
  password: string;
  phone?: string;
  birth?: Date;
  height?: number;
  employee: string;
}
