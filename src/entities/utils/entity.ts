import { PlainRecordModel } from 'entities/models'
import {
    Entity,
} from 'typeorm'

export default {
    create(record: typeof PlainRecordModel) {
        const {
            name,
        } = record.table

        Entity({
            name,
        })(record)

        return record
    }
}
