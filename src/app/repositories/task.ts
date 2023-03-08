import RepositoryModel, { GETTER, OPTION, Returned, TypeFilter } from 'sub_modules/utils/libs/typeorm'
import { EntityManager, SelectQueryBuilder } from 'typeorm'
import TaskRecord, { TaskInterface } from 'entities/records/task'
import { TypeInsert, TypeUpdate } from 'entities/types'


class TaskRepository extends RepositoryModel {

	static __displayName = 'TaskRepository'

	// ============================= INSERT =============================

	async insert(task: TypeInsert<TaskInterface>, trx: EntityManager) {
		return await this.queryInsert<TaskInterface>(TaskRecord, task, trx)
	}

	// ============================= UPDATE =============================

	async update(task: TypeUpdate<TaskInterface>, trx: EntityManager) {
		return await this.queryUpdate<TaskInterface>(TaskRecord, task, trx)
	}

	// ============================= GETTER =============================

	async getTask<T extends TaskInterface, GET extends GETTER>(
		{
			filter,
			option,
		}: {
			filter?: TypeFilter<Partial<TaskInterface>>,
			option: OPTION<GET>
		}, transaction: EntityManager
	): Returned<T, GET> {
		return await this.querySelectNew(TaskRecord, 'task', (Q: SelectQueryBuilder<T>) => {
			return Q
		}, { ...option, filter }, transaction)
	}

	// ============================= DELETE =============================

	async delete(id: number, trx: EntityManager) {
		return await this.queryDelete<TaskInterface>(TaskRecord, { id }, trx)
	}

	// ============================ PRIVATES ============================
}

export default new TaskRepository()
