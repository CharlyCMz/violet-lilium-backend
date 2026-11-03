import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const yaml_file = 'config.yml';

export default () => {
  const configPath = join(__dirname, '..', yaml_file);
  return yaml.load(readFileSync(configPath, 'utf-8')) as AppConfig;
};

export type AppConfig = {
  violetLilium: {
    port: number;
    jwtSecret: string;
    jwtExpiresIn: string;
    bcryptRounds: number;
    adminUsername: string;
    adminPassword: string;
  };
  database: {
    username: string;
    password: string;
    dbName: string;
    host: string;
    port: number;
  };
};
