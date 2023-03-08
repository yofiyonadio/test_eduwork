import {
	config,
} from 'dotenv'
import 'reflect-metadata'

config()

import Database from '../database'
import Server from '.'
import { TYPE_CONFIG as TYPES_CONFIG } from 'types'
import { CONFIG } from 'app/config'

declare global {
	function CONFIG(): TYPES_CONFIG
	type TYPE_CONFIG = CONFIG
}

global.CONFIG = () => {
	return CONFIG as TYPES_CONFIG
}

Database
	.init(CONFIG.CONFIG_DB)
	.then(async () => Server.init())
	.catch(e => Log(e))
