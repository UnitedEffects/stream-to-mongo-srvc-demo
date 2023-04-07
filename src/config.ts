import { IConfigs } from './types';
import fs from 'fs';
import { createRequire } from "module";

const env = process.env.NODE_ENV || 'dev';
const dir = (fs.existsSync('./.env')) ? '.env' : '.env_ci';
const require = createRequire(import.meta.url);
const envVars = require(`../${dir}/env.${env}.json`);

export const config: IConfigs = {
    ENV : process.env.NODE_ENV || envVars.NODE_ENV || 'dev',
    PROTOCOL : process.env.PROTOCOL || envVars.PROTOCOL || 'http',
    MONGO : process.env.MONGO || envVars.MONGO || 'mongodb://localhost:27017/your-db',
    HOST : process.env.HOST || envVars.HOST || 'localhost:3000',
    UEA_API : process.env.UEA_API || envVars.UEA_API,
    CORE_EOS_PLATFORM_ID : process.env.CORE_EOS_PLATFORM_ID || envVars.CORE_EOS_PLATFORM_ID,
    CORE_THIS_SERVICE_CC_AUTHORITY : process.env.CORE_THIS_SERVICE_CC_AUTHORITY || envVars.CORE_THIS_SERVICE_CC_AUTHORITY,
    CORE_THIS_SERVICE_CLIENT_ID : process.env.CORE_THIS_SERVICE_CLIENT_ID || envVars.CORE_THIS_SERVICE_CLIENT_ID,
    CORE_THIS_SERVICE_CLIENT_SECRET : process.env.CORE_THIS_SERVICE_CLIENT_SECRET || envVars.CORE_THIS_SERVICE_CLIENT_SECRET,
    CORE_ASSOCIATED_PRODUCT_ID : process.env.CORE_ASSOCIATED_PRODUCT_ID || envVars.CORE_ASSOCIATED_PRODUCT_ID,
    UES_API : process.env.UES_API || envVars.UES_API,
    UES_SERVER : process.env.UES_SERVER || envVars.UES_SERVER,
    UES_INBOX : process.env.UES_INBOX || envVars.UES_INBOX,
    UES_CONSUMER : process.env.UES_CONSUMER || envVars.UES_CONSUMER,
    UES_STREAM : process.env.UES_STREAM || envVars.UES_STREAM,
    UES_SUBJECT : process.env.UES_SUBJECT || envVars.UES_SUBJECT,
    UES_QUEUE_GROUP : process.env.UES_QUEUE_GROUP || envVars.UES_QUEUE_GROUP,
    UES_ACCESS_SEED : process.env.UES_ACCESS_SEED || envVars.UES_ACCESS_SEED,
    UES_ACCESS_PUBLIC_KEY : process.env.UES_ACCESS_PUBLIC_KEY || envVars.UES_ACCESS_PUBLIC_KEY,
    UES_CLIENT_ID : process.env.UES_CLIENT_ID || envVars.UES_CLIENT_ID,
    UES_CLIENT_SECRET : process.env.UES_CLIENT_SECRET || envVars.UES_CLIENT_SECRET,
    UES_DEBUG : process.env.UES_DEBUG || envVars.UES_DEBUG,
    UEA_CLIENT_ASSERTION_TYPE : process.env.UEA_CLIENT_ASSERTION_TYPE || envVars.UEA_CLIENT_ASSERTION_TYPE,
}