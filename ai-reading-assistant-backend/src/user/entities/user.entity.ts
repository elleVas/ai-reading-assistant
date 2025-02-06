import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { SummaryRequest } from '../../summary/entities/summary.entity';

@ObjectType() // Per GraphQL
@Entity()
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fullName?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  password?: string; // Solo per autenticazione con email e password

  @Field({ nullable: true })
  @Column({ nullable: true })
  googleId?: string; // Per login con Google

  @Field()
  @Column({ default: false })
  isPremium: boolean; // Per distinguere gli utenti premium

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => SummaryRequest, (summary) => summary.user)
  summaries: SummaryRequest[];
}
