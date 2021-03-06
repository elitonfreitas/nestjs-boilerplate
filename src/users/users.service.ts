import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<unknown> {
    const createdUser = await this.userModel.create(createUserDto);
    return { _id: createdUser._id };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).lean();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, { new: true }).lean();
  }

  async remove(id: string): Promise<User> {
    const deletedCat = await this.userModel.findByIdAndRemove({ _id: id }).exec();
    return deletedCat;
  }
}
