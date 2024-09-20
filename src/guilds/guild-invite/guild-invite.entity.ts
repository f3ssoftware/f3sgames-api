/* istanbul ignore file */
import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Player } from '../../players/player.entity';
import { Guild } from '../guild.entity';

@Entity({ name: 'guild_invites' })
export class GuildInvite {
  @PrimaryColumn()
  player_id: number;

  @PrimaryColumn()
  guild_id: number;

  @ManyToOne(() => Player, (player) => player.guildInvites)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @ManyToOne(() => Guild, (guild) => guild.invites)
  @JoinColumn({ name: 'guild_id' })
  guild: Guild;
}
