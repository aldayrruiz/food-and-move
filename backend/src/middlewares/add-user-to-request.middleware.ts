import { EmployeesService } from '@modules/employees/employees.service';
import { PatientsService } from '@modules/patients/patients.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// THIS IS NOT USED BECAUSE IT IS REPLACED BY JWT, BUT IT IS A GOOD EXAMPLE OF HOW TO USE MIDDLEWARES
@Injectable()
export class AddUserToRequestMiddleware implements NestMiddleware {
  constructor(private readonly employeeService: EmployeesService, private readonly patientsService: PatientsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const jwt = req.headers.authorization?.split(' ')[1];
    const payload = jwt?.split('.')[1];
    const decodedPayload = Buffer.from(payload || '', 'base64').toString('utf-8');
    const parsedPayload = JSON.parse(decodedPayload);
    const userId = parsedPayload?.sub;
    let user;
    if (parsedPayload?.role === 'patient') {
      user = await this.patientsService.findById(userId);
    } else {
      user = await this.employeeService.findOne(userId);
    }
    if (!user) throw new Error('Employee not found');
    req.user = user;
    next();
  }
}
