import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    try {
      console.log('Attempting to validate user:', email);
      const user = await this.usersService.findByEmail(email);
      
      if (!user) {
        console.log('User not found');
        return null;
      }
      
      console.log('User found, comparing passwords');
      const match = await bcrypt.compare(pass, user.password);
      console.log('Password match:', match);
      
      if (match) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error in validateUser:', error);
      return null;
    }
  }

  async login(user: any) {
    const payload = { sub: user.userID, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
