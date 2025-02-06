import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data.source';
import { ConfigModule } from '@nestjs/config';
import { SummaryModule } from './summary/summary.module';
import { UserModule } from './user/user.module';




@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.development.env', isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Specifica il driver Apollo
      autoSchemaFile: true,
    }),
    // Usa la configurazione dal DataSource
    TypeOrmModule.forRoot(AppDataSource.options),
    SummaryModule,
    UserModule
  ],
})
export class AppModule {}

