import { ControllerModel } from 'app/models'
import { Request, Response } from 'express'
import { Validator } from 'sub_modules/utils/helpers/validator'
import { parseQuerys } from 'sub_modules/utils'
import { Anyses } from 'sub_modules/apiface/_type'
import { Apiface_V1_Tasks } from 'sub_modules/apiface'
import { TaskRepository } from 'app/repositories'

type Apiface = Apiface_V1_Tasks
class TaskController extends ControllerModel {

	route(): Anyses<Apiface> {
		return {
			'/tugas': {
				get: this.getTasks,
				post: this.createTask
			},
			'/tasks/:id': {
				get: this.getTask,
				patch: this.updateTask,
				delete: this.deleteTask
			}
		}
	}

	private deleteTask = async (req: Request, res: Response):
		Apiface['/tasks/:id']['delete']['response'] =>
		this.transaction(req, res, async transaction => {
			const id = parseInt(req.params.id, 10)

			Validator({ id }, { id: 'number' })

			await TaskRepository.delete(id, transaction)
		})

	private updateTask = async (req: Request, res: Response):
		Apiface['/tasks/:id']['patch']['response'] =>
		this.transaction(req, res, async transaction => {
			const id = parseInt(req.params.id, 10)
			const task: Apiface['/tasks/:id']['patch']['body'] = req.body

			Validator({
				...task,
				id
			}, {
				id: 'number',
				judul: 'string?',
				deskripsi: 'string?',
				selesai: 'boolean?'
			})

			await TaskRepository.update({ ...task, id }, transaction)
		})

	private createTask = async (req: Request, res: Response):
		Apiface['/tugas']['post']['response'] =>
		this.transaction(req, res, async transaction => {
			const task: Apiface['/tugas']['post']['body'] = req.body

			Validator(task, {
				judul: 'string',
				deskripsi: 'string?',
				selesai: 'boolean?'
			})

			return await TaskRepository.insert(task, transaction)
		})

	private getTask = async (req: Request, res: Response):
		Apiface['/tasks/:id']['get']['response'] =>
		this.transaction(req, res, async transaction => {
			const id = parseInt(req.params.id, 0) || undefined

			Validator({ id }, { id: 'number' })

			return await TaskRepository.getTask({
				filter: {
					id
				},
				option: {
					get: 'ONE',
				}
			}, transaction)
		})

	private getTasks = async (req: Request, res: Response):
		Apiface['/tugas']['get']['response'] =>
		this.transaction(req, res, async transaction => {

			const task: Apiface['/tugas']['get']['query'] =
				parseQuerys(req, {
					id: 'NUMBER',
					judul: 'STRING',
					deskripsi: 'STRING',
					selesai: 'BOOL'
				})

			Validator(task, {
				id: 'number?',
				judul: 'string?',
				deskripsi: 'string?',
				selesai: 'boolean?'
			})

			return await TaskRepository.getTask({
				filter: task,
				option: {
					get: 'MANY',
					getAllWhenNoFilter: true
				}
			}, transaction)
		})

}
export default new TaskController()
