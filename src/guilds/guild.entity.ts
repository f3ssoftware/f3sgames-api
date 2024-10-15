/* istanbul ignore file */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GuildMembership } from './guild-membership/guild-membership.entity';
import { Player } from '../players/player.entity';
import { GuildInvite } from './guild-invite/guild-invite.entity';

@Entity({ name: 'guilds' })
export class Guild {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  level: number;

  @Column()
  name: string;

  @Column({ name: 'ownerid' })
  ownerId: number;

  @Column({ name: 'creationdata' })
  creationData: number;

  @Column({ default: '' })
  motd: string;

  @Column({ default: 0 })
  residence: number;

  @Column({ default: 0 })
  balance: number;

  @Column({ default: 0 })
  points: number;

  @OneToMany(() => GuildMembership, (guildMembership) => guildMembership.guild)
  members: GuildMembership[];

  @OneToMany(() => GuildInvite, (guildInvite) => guildInvite.guild)
  invites: GuildInvite[];
}
