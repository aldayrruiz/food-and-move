import { AttachmentsModule } from '@modules/attachments/attachments.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ConsultsModule } from '@modules/consults/consults.module';
import { DietsModule } from '@modules/diets/diets.module';
import { EmployeesModule } from '@modules/employees/employees.module';
import { FeedbackModule } from '@modules/feedback/feedback.module';
import { FilesModule } from '@modules/files/files.module';
import { FoodsModule } from '@modules/foods/foods.module';
import { MailModule } from '@modules/mail/mail.module';
import { MovesModule } from '@modules/moves/moves.module';
import { PatientsModule } from '@modules/patients/patients.module';
import { RecipesModule } from '@modules/recipes/recipes.module';
import { RoutinesModule } from '@modules/routines/routines.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomQueryService } from '@services/custom-query.service';
import { UploadsService } from '@services/uploads.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseConfigService } from './db/mongoose.service';
import { AddOwnerToBodyMiddleware } from './middlewares/add-owner-to-body.middleware';
import { AddUserToRequestMiddleware } from './middlewares/add-user-to-request.middleware';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    ConfigModule.forRoot({ isGlobal: true }),
    EmployeesModule,
    PatientsModule,
    ConsultsModule,
    RecipesModule,
    RoutinesModule,
    FoodsModule,
    MovesModule,
    AuthModule,
    FilesModule,
    DietsModule,
    AttachmentsModule,
    MailModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomQueryService, UploadsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AddOwnerToBodyMiddleware)
      .exclude({
        path: 'api/auth/(.*)',
        method: RequestMethod.ALL,
      })
      .forRoutes({
        path: '*',
        method: RequestMethod.POST,
      })
      .apply(AddOwnerToBodyMiddleware)
      .forRoutes({
        path: '*',
        method: RequestMethod.PUT,
      });

    consumer
      .apply(AddUserToRequestMiddleware)
      .exclude(
        {
          path: 'api/auth/(.*)',
          method: RequestMethod.ALL,
        },
        {
          path: 'api/files/(.*)',
          method: RequestMethod.ALL,
        }
      )
      .forRoutes('*');
  }
}
