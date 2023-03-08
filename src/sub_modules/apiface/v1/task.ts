import { TaskInterface } from 'entities/records/task'
import { TypeInsert } from 'entities/types'

type Tasks = {
    '/tugas': {
        get: {
            query: Partial<TaskInterface>,
            response: Promise<TaskInterface[]>
        }
        post: {
            body: TypeInsert<TaskInterface>
            response: Promise<TaskInterface>
        }
    }
    '/tasks/:id': {
        get: {
            response: Promise<TaskInterface>
        }
        patch: {
            body: Partial<TaskInterface>
            response: Promise<void>
        }
        delete: {
            response: Promise<void>
        }
    }
}

export default Tasks
