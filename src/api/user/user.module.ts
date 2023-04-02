import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserStatus } from './interfaces/user.interface';
import { BcryptModule } from '@app/bcrypt';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function (next) {
            console.log('pre save hook');
            next();
          });
          schema.pre(/^find/, function (next) {
            this.find({ status: { $ne: UserStatus.DELETED } });
            next();
          });
          return schema;
        },
      },
    ]),
    BcryptModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
