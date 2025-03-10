import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReportService } from './report.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [ReportService]
})
export class ReportModule {}