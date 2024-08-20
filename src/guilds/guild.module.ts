// guild.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guild } from './guild.entity';
import { GuildMembership } from './guild-membership/guild-membership.entity';
import { GuildInvite } from './guild-invite/guild-invite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guild, GuildMembership, GuildInvite], 'gameConnection'),
  ],
  exports: [TypeOrmModule],
})
export class GuildModule {}
