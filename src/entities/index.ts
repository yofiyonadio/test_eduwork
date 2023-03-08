import {
    config,
} from 'dotenv'
import 'reflect-metadata'

config()

import { DataSource } from 'typeorm'
import * as _Records from './records'
import { EntityUtils, SeederUtils } from './utils'

import { TYPE_CONFIG as TYPES_CONFIG } from 'types'
import { CONFIG as _CONFIG } from 'app/config'
import { Logger as _Logger, Log as _Log } from 'sub_modules/utils/helpers/logger'

const CONFIG = () => {
    return _CONFIG as TYPES_CONFIG
}

const Logger = (...arg: Parameters<typeof _Logger>) => _Logger(...arg)
const Log = (...arg: Parameters<typeof _Log>) => _Log(...arg);

(async () => {
    const Records = Object.values(_Records)

    const __CONFIG = CONFIG().CONFIG_DB[0]

    const __dataSource = new DataSource({
        type: 'mariadb',
        host: __CONFIG.DB_HOST,
        port: __CONFIG.DB_PORT,
        username: __CONFIG.DB_USER,
        password: __CONFIG.DB_PASS,
        logging: true
    })

    const __connection = await __dataSource.initialize()

    await __connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)

    const dataSource = new DataSource({
        type: 'mariadb',
        host: __CONFIG.DB_HOST,
        port: __CONFIG.DB_PORT,
        database: __CONFIG.DB_NAME,
        username: __CONFIG.DB_USER,
        password: __CONFIG.DB_PASS,
        logging: true,
        entities: Object.keys(Records).map(key => EntityUtils.create(Records[key])),
    })

    await __connection.destroy()
    await dataSource.initialize().then(async connection => {

        const qR = connection.createQueryRunner()
        await qR.connect()
        await qR.startTransaction()

        try {
            await qR.connection.synchronize()

            for (const query of SeederUtils.createSEEDER()) {
                for (const Q of query) {
                    await qR.query(Q)
                }
            }

            await qR.commitTransaction()
            await qR.release()
            Logger('DATABASE', 'Success migrate on DB ' + process.env.DB_HOST + ' .......')
            process.exit()
        } catch (e) {
            Log(e)
            await qR.rollbackTransaction()
            await qR.release()
        }
    })
})()

