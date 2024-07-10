import 'tsconfig-paths/register';
import { createConnection } from 'typeorm';
import { Account } from './account.entity';
import { Player } from '../players/player.entity'; // Certifique-se de importar todas as entidades necessárias
import { PlayersOnline } from '../players-online/entities/players-online.entity'; // Importação necessária
import { hashSync } from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function updatePassword() {
  const connection = await createConnection({
    type: 'mysql',
    host: 'localhost', // altere de mariadb_db para localhost
    port: Number(process.env.GAME_DATABASE_PORT),
    username: process.env.GAME_DATABASE_USERNAME,
    password: process.env.GAME_DATABASE_PASSWORD,
    database: process.env.GAME_DATABASE_NAME,
    entities: [Account, Player, PlayersOnline], // Certifique-se de incluir todas as entidades
  });

  const accountRepository = connection.getRepository(Account);

  // Substitua pelo ID da conta que deseja atualizar
  const accountId = 2;
  const newPassword = '428181Abc#';

  const account = await accountRepository.findOne({ where: { id: accountId } });
  if (account) {
    account.password = hashSync(newPassword, 10);
    await accountRepository.save(account);
    console.log('Password updated successfully');
  } else {
    console.log('Account not found');
  }

  await connection.close();
}

updatePassword().catch((error) => console.log(error));