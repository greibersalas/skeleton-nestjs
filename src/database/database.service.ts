import { TypeOrmModule } from '@nestjs/typeorm'
import { Configuration } from '../config/config.keys'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'
import { ConnectionOptions } from 'typeorm'

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ ConfigModule],
        inject: [ConfigService],
        async useFactory(config: ConfigService){
            return {
                //ssl: true,
                type: 'postgres' as 'postgres',
                host: config.get(Configuration.HOST),
                username: config.get(Configuration.USER),                
                password: config.get(Configuration.PASSWORD),
                port : 5432,
                database: config.get(Configuration.DATABASE),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/migrations/*.{.ts,.js}'],
                //logging: true
            } as ConnectionOptions
        }
    })
]