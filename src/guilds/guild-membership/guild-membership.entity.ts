/* istanbul ignore file */
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Player } from '../../players/player.entity';
  import { Guild } from '../guild.entity';
  
  @Entity({ name: 'guild_membership' })
  export class GuildMembership {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => Player, (player) => player.guildMembership)
    @JoinColumn({ name: 'player_id' })
    player: Player;
  
    @ManyToOne(() => Guild, (guild) => guild.members)
    @JoinColumn({ name: 'guild_id' })
    guild: Guild;
  
    @Column()
    rank_id: number;
  
    @Column({ default: '' })
    nick: string;
  }
  