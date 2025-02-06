import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

import { User } from '../../user/entities/user.entity';

@ObjectType() // Per GraphQL
@Entity()
export class SummaryRequest {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'text' })
  originalText: string;

  @Field()
  @Column({ type: 'text' })
  summarizedText: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
  
    @ManyToOne(() => User, (user) => user.summaries, { nullable: false })
  user: User;
}
