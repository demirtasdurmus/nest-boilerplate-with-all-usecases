import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { IConfig } from 'src/config/config.interface';

@Injectable()
export class MongooseConnectionUtil implements MongooseOptionsFactory {
  constructor(private readonly config: ConfigService<IConfig>) {}

  createMongooseOptions(): MongooseModuleOptions | Promise<MongooseModuleOptions> {
    return {
      uri: `mongodb://${this.config.get('DB_HOST', { infer: true })}:${this.config.get('DB_PORT', { infer: true })}`,
      socketTimeoutMS: 15000,
      dbName: this.config.get('DB_NAME', { infer: true }),
      authSource: this.config.get('DB_AUTHSOURCE', { infer: true }),
      user: this.config.get('DB_USER', { infer: true }),
      pass: this.config.get('DB_PASS', { infer: true }),
      connectionFactory(connection: Connection) {
        setTimeout(() => {
          console.log(`Connected to ${connection.name} db successfully`);
        }, 1000);
        return connection;
      },
    };
  }
}
