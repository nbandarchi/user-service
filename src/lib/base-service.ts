import type { PgColumn } from 'drizzle-orm/pg-core';
import type { DbClient } from '../db/client';
import { type ColumnBaseConfig, eq } from 'drizzle-orm';
import type { AnyPgTable } from 'drizzle-orm/pg-core';

// Use string type for UUIDs to match PostgreSQL's UUID format
export type UUID = `${string}-${string}-${string}-${string}`;

type SelectModel<T extends AnyPgTable> = T['$inferSelect'];
type InsertModel<T extends AnyPgTable> = T['$inferInsert'];
type UpdateModel<T extends AnyPgTable> = Partial<T['$inferInsert']>;

export abstract class BaseService<
	TTable extends AnyPgTable & {
		id: PgColumn<ColumnBaseConfig<'string', 'PgUUID'>>;
	},
> {
	constructor(
		protected db: DbClient,
		protected table: TTable,
	) {}

	public async getAll(): Promise<SelectModel<TTable>[]> {
		return this.db.select().from(this.table as AnyPgTable);
	}

	public async getById(id: UUID): Promise<SelectModel<TTable> | null> {
		const [row] = await this.db
			.select()
			.from(this.table as AnyPgTable)
			.where(eq(this.table.id, id))
			.limit(1);

		return row || null;
	}

	public async create(data: InsertModel<TTable>): Promise<SelectModel<TTable>> {
		const [inserted] = await this.db
			.insert(this.table)
			.values(data)
			.returning();
		return inserted;
	}

	public async update(
		id: UUID,
		data: UpdateModel<TTable>,
	): Promise<SelectModel<TTable>> {
		const [updated] = await this.db
			.update(this.table as AnyPgTable)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(this.table.id, id))
			.returning();
		return updated;
	}

	public async delete(id: UUID): Promise<boolean> {
		const result = await this.db
			.delete(this.table)
			.where(eq(this.table.id, id));
		return (result?.rowCount ?? 0) > 0;
	}
}
