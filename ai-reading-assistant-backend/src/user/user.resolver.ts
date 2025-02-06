import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async getUsers() {
    return this.userService.findAll();
  }

  @Query(() => User)
  async getUser(@Args('id') id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(@Args('email') email: string) {
    return this.userService.createUser(email);
  }

  @Mutation(() => User)
  async upgradeToPremium(@Args('id') id: number) {
    return this.userService.upgradeToPremium(id);
  }
}

