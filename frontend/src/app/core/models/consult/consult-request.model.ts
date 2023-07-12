export interface ConsultRequestModel {
  patient: string;
  masa?: number;
  imc?: number;
  per_abdominal?: number;
  tension?: number;
  trigliceridos?: number;
  hdl?: number;
  ldl?: number;
  hemoglobina?: number;
  glucosa?: number;
  comments: string;
  created_at: Date;
}
