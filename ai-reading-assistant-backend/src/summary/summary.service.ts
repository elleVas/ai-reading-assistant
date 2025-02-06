import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SummaryRequest } from './entities/summary.entity';
import { User } from '../user/entities/user.entity';
import axios from 'axios';

import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class SummaryService {
    
  private openAiApiKey = process.env.OPENAI_API_KEY;
  private openAiUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(
    @InjectRepository(SummaryRequest)
    private readonly summaryRepo: Repository<SummaryRequest>,
    
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<SummaryRequest[]> {
    return this.summaryRepo.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<SummaryRequest | null> {
    return this.summaryRepo.findOne({ where: { id }, relations: ['user'] });
  }


    async summarizeText(userId: number,text: string): Promise<string> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    try {
      const response = await axios.post(
        this.openAiUrl,
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant that summarizes texts.' },
            { role: 'user', content: `Summarize the following text:\n\n"${text}"` }
          ],
          max_tokens: 200,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openAiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const summary = response.data.choices[0].message.content.trim();

      // Salviamo la richiesta nel database
      const savedRequest = this.summaryRepo.create({ originalText: text, summarizedText: summary });
      await this.summaryRepo.save(savedRequest);

      return summary;
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      throw new Error('Failed to summarize text');
    }
  }

 /* async summarizeText(userId: number, text: string): Promise<SummaryRequest> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // Simuliamo il riassunto (in futuro potresti integrare OpenAI o un altro servizio AI)
    const summarizedText = text.substring(0, 50) + "...";  

    const newSummary = this.summaryRepo.create({ 
      originalText: text, 
      summarizedText, 
      user 
    });

    return this.summaryRepo.save(newSummary);
  }*/

  async delete(id: number): Promise<void> {
    await this.summaryRepo.delete(id);
  }
}



