import RecordModel, { TypeColumns } from '../models/record'

import {
    Column
} from 'typeorm'
import { InterfaceModel } from '../models'

export interface TaskInterface extends InterfaceModel {
    judul: string
    deskripsi: string
    selesai: boolean
}


export class TaskRecord extends RecordModel implements Required<TaskInterface> {

    public static table = {
        name: 'task',
        comment: '@omit create,update,delete',
    }

    public static columns: TypeColumns<TaskInterface> = {
        ...RecordModel.base_columns(),
        judul: true,
        deskripsi: true,
        selesai: true,
    }

    @Column({
        ...RecordModel.column_varchar({
            nullable: false,
            length: '50'
        })
    })
    judul: string

    @Column({
        ...RecordModel.column_varchar({
            nullable: true,
            length: '255'
        })
    })
    deskripsi: string

    @Column({
        ...RecordModel.column_boolean({
            defaults: false
        })
    })
    selesai: boolean


    // ====================== TYPORM RELATION DEFINITION =======================

}

export default TaskRecord
