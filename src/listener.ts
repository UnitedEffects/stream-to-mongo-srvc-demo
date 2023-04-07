import {connect, StringCodec, credsAuthenticator, consumerOpts, createInbox } from 'nats';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import JWT from 'jsonwebtoken';
import h from './helper.js';
import qs from 'querystring';
import cache from './cache/cacheMap.js';
import {nanoid} from 'nanoid';
import { config } from './config.js';
const sc = StringCodec();

const CACHE_NAME = 'NATS';
const CACHE_KEY = 'nats-jwt';
const CLIENT_ASSERTION_TYPE = config.UEA_CLIENT_ASSERTION_TYPE;

// FOR DEBUG USING STATIC JWT
export class UESListener {
    nats: string
    seed: string
    upk: string
    subject: string
    queue: string|null
    stream: string|null
    inbox: string
    consumer: string
    natsCId: string
    natsCSecret: string
    debug: boolean
    natsJwtIssuer: string
    nc: any
    js: any
    jsm: any
    jwt: any
    creds: any

    constructor() {
        this.nats = config.UES_SERVER;
        this.seed = config.UES_ACCESS_SEED;
        this.upk = config.UES_ACCESS_PUBLIC_KEY;
        this.subject = config.UES_SUBJECT;
        this.queue = config.UES_QUEUE_GROUP;
        this.stream = config.UES_STREAM;
        this.inbox = config.UES_INBOX;
        this.consumer = config.UES_CONSUMER;
        this.natsJwtIssuer = config.UES_API;
        this.natsCId = config.UES_CLIENT_ID;
        this.natsCSecret = config.UES_CLIENT_SECRET;
        this.debug = config.UES_DEBUG;
    }
    async connect() {
        try {
            await cache.clear(CACHE_NAME, CACHE_KEY);
            if(this.nc) await this.nc.close();
            this.jwt = await this.getJwt();
            this.creds = creds(this.seed, this.jwt);
            this.nc = await connect({
                name: `demo-dash-${nanoid(6)}`,
                servers: this.nats,
                authenticator: credsAuthenticator(new TextEncoder().encode(this.creds)),
                inboxPrefix: this.inbox,
                debug: this.debug
            });
            this.js = await this.nc.jetstream();
            this.jsm = await this.nc.jetstreamManager();
            await this.jsm.streams.info(this.stream);
            (async () => {
                for await (const s of this.nc.status()) {
                    switch (s.data) {
                        case 'AUTHORIZATION_VIOLATION':
                        case 'AUTHENTICATION_EXPIRED':
                            await this.connect();
                            await this.listen();
                            break;
                        default:
                    }
                }
            })().then();
        } catch (error) {
            if(this.nc) await this.nc.close();
            console.error(error);
            throw new Error('Could not initiate listener - check NATS configurations');
        }
    }
    async listen() {
        try {
            console.info('listening...');
            const opts = consumerOpts();
            if(this.queue) opts.queue(this.queue);
            opts.durable(this.consumer);
            opts.manualAck();
            opts.ackExplicit();
            opts.deliverTo(createInbox(this.inbox));
            opts.idleHeartbeat(500);
            let sub = await this.js.subscribe(`${this.subject}`, opts);
            await (async () => {
                for await (const m of sub) {
                    const d = sc.decode(m.data);
                    const data = (h.isJson(d)) ? JSON.parse(d) : d;
                    if(this.debug){
                        console.info(`Received: ${sub.getReceived()} ---`, data);
                    }
                    try {
                        await saveStreamData(m.subject, data);
                    } catch (e) {
                        console.info(e);
                        //do nothing else
                    }
                    m.ack();
                }
            })();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    async getJwt() {
        try {
            let uJwt = await cache.find(CACHE_NAME, CACHE_KEY);
            if(uJwt) return uJwt;
            const url = this.natsJwtIssuer;
            const clientId = this.natsCId;
            const userPublicKey = this.upk;
            const expires = 3600;
            const group = config.CORE_EOS_PLATFORM_ID;
            const secret = this.natsCSecret;
            const token = await getCC(group, url, clientId, secret);
            if(!token) throw new Error('Unable to get a token');
            const options = {
                method: 'post',
                url: `${url}/api/${group}/shared/simple/access-op/jwt`,
                headers: {
                    'content-type': 'application/json',
                    'authorization': `bearer ${token}`
                },
                data: {
                    publicKey: userPublicKey,
                    coreClientId: clientId,
                    expires
                }
            };
            const result = await axios(options);
            if(!result?.data?.data?.jwt) throw new Error('Unable to get a NATS user jwt');
            await cache.set(CACHE_NAME, CACHE_KEY, result.data.data.jwt, expires);
            return result.data.data.jwt;
        } catch (error: any) {
            console.error(error?.response?.data || error);
            throw error;
        }
    }
}

function creds(seed: string, jwt: string) {
    return `-----BEGIN NATS USER JWT-----
    ${jwt}
  ------END NATS USER JWT------
************************* IMPORTANT *************************
  NKEY Seed printed below can be used sign and prove identity.
  NKEYs are sensitive and should be treated as secrets.
  -----BEGIN USER NKEY SEED-----
    ${seed}
  ------END USER NKEY SEED------
`;
}

async function saveStreamData(subject: string, data: any) {
    const sub = subject.split('.');
    console.info('Subject', sub);
    if(data){
        console.info('SAVING DATA', data);
        //todo new write...
        /*
        const e = {
            authGroup: data.group,
            eventSource: sub[3],
            eventId: data.id,
            event: data.event,
            eventTime: data.eventTime,
            eventMessage: data.message,
            eventData: data.data,
        };
        return audit.save(e);

         */
    }
    throw 'DATA MISSING REQUIRED FIELDS';
}

async function getSecretJwt(id: string, secret: string, aud: string, minutes: number = 1) {
    const clientSecret = secret;
    const clientId = id;

    const claims = {
        iat: Math.floor(Date.now()/1000),
        exp: Math.floor(Date.now()/1000 + (minutes*60)),
        iss: clientId,
        aud,
        sub: clientId,
        jti: uuid()
    };

    return JWT.sign(claims, clientSecret);
}

async function getCC(group: string, issuer: string, id: string, secret: string) {
    try {
        const url = `${config.UEA_API}/${group}/token`;
        const aud = `${config.UEA_API}/${group}`;
        // below is for local debug only
        //const url = `https://qa.uecore.io/${group}/token`;
        //const aud = `https://qa.uecore.io/${group}`;

        const jwt = await getSecretJwt(id, secret, aud);
        const options = {
            method: 'post',
            url,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify({
                grant_type: 'client_credentials',
                client_assertion_type: CLIENT_ASSERTION_TYPE,
                client_assertion: jwt,
                audience: `${issuer}/api/${group}`,
                scope: 'access'
            })
        };
        const data = await axios(options);
        return data?.data?.access_token;
    } catch (error: any) {
        if(error.isAxiosError) console.error(error?.response?.data);
        else console.error(error);
        throw error;
    }
}