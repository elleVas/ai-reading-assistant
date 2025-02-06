import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SummaryService } from './summary.service';
import { SummaryRequest } from './entities/summary.entity';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

@Resolver(() => SummaryRequest)
export class SummaryResolver {
  constructor(private readonly summaryService: SummaryService) {}

  @Query(() => [SummaryRequest])
  async getSummaries() {
    return this.summaryService.findAll();
  }

  @Query(() => SummaryRequest)
  async getSummary(@Args('id') id: number) {
    return this.summaryService.findOne(id);
  }

  
  @UseGuards(AuthGuard('jwt'))
  @Mutation(() => SummaryRequest)
  async createSummary(
    @Args('userId') userId: number,
    @Args('text') text: string
  ) {
    return this.summaryService.summarizeText(userId, text);
  }

  @Mutation(() => Boolean)
  async deleteSummary(@Args('id') id: number) {
    await this.summaryService.delete(id);
    return true;
  }
}


