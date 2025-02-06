import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummaryService } from './summary.service';
import { SummaryRequest } from './entities/summary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SummaryRequest])],
  providers: [SummaryService],
})
export class SummaryModule {}
