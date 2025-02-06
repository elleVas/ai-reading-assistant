import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userService: UserService,
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new Error('Email già in uso');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async login(
    email: string,
    password: string | Buffer<ArrayBufferLike>,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenziali non valide');
    let isPasswordValid: boolean = false;
    if (user.password) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      throw new UnauthorizedException('error:Credenziali non valide');
    }
    if (!isPasswordValid)
      throw new UnauthorizedException('Credenziali non valide');

    const payload = { userId: user.id, isPremium: user.isPremium };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async validateOAuthUser(profile: any): Promise<User> {
    const { id, emails, displayName } = profile;
    const email = emails?.[0]?.value || `${id}@noemail.com`;

    let user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      user = this.userRepository.create({
        email,
        fullName: displayName || 'Anonymous',
        isPremium: true, // Gli utenti OAuth possono essere premium
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  async loginOAuth(
    profile: any,
  ): Promise<{ access_token: string; user: User }> {
    const { id, emails, displayName } = profile;
    const email = emails?.[0]?.value || `${id}@noemail.com`;

    let user = await this.userService.findByEmail(email);
    if (!user) {
      user = await this.userService.createOAuthUser({
        email,
        fullName: displayName || 'Anonymous',
        isPremium: true, // Puoi personalizzarlo in base alle esigenze
      });
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
