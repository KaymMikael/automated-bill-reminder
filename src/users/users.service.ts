import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  findById(id: string) {
    return this.userModel.findByPk(id);
  }

  async createOne(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    const SALT = 10;
    const [user, passwordHash] = await Promise.all([
      this.findByEmail(email),
      bcrypt.hash(password, SALT),
    ]);

    if (user) {
      throw new ConflictException(
        'Account already exists, please login or try another email',
      );
    }

    return this.userModel.create({ name, email, passwordHash });
  }
}
