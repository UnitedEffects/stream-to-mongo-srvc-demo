export interface IConfigs {
    ENV: string,
    PROTOCOL: string,
    MONGO: string,
    HOST: string,
    CORE_EOS_PLATFORM_ID: string,
    CORE_THIS_SERVICE_CC_AUTHORITY: string,
    CORE_THIS_SERVICE_CLIENT_ID: string,
    CORE_THIS_SERVICE_CLIENT_SECRET: string,
    CORE_ASSOCIATED_PRODUCT_ID: string
    UEA_API: string,
    UES_API: string,
    UES_SERVER: string,
    UES_INBOX: string,
    UES_CONSUMER: string,
    UES_STREAM: string|null,
    UES_SUBJECT: string,
    UES_QUEUE_GROUP: string|null,
    UES_ACCESS_SEED: string,
    UES_ACCESS_PUBLIC_KEY: string,
    UES_CLIENT_ID: string,
    UES_CLIENT_SECRET: string,
    UEA_CLIENT_ASSERTION_TYPE: string
    UES_DEBUG: boolean
}