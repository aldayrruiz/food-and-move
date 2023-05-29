export interface EmployeeModel {
  _id: string;
  name: string;
  surname?: string;
  email: string;
  phone?: string;
  admin: boolean;
  profile_image?: string;
}
