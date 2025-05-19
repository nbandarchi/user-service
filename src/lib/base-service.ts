import type { PgColumn } from 'drizzle-orm/pg-core'
import type { DbClient } from '../db/client'
import { type ColumnBaseConfig, eq } from 'drizzle-orm'
import type { AnyPgTable } from 'drizzle-orm/pg-core'

// Use string type for UUIDs to match PostgreSQL's UUID format
export type Uuid = `${string}-${string}-${string}-${string}`

type SelectModel<T extends AnyPgTable> = T['$inferSelect']
type InsertModel<T extends AnyPgTable> = T['$inferInsert']
type UpdateModel<T extends AnyPgTable> = Partial<T['$inferInsert']>

export abstract class BaseService<
    T extends AnyPgTable & {
        id: PgColumn<ColumnBaseConfig<'string', 'PgUUID'>>
    },
> {
    constructor(
        protected db: DbClient,
        protected table: T,
    ) {}

    public async getAll(): Promise<SelectModel<T>[]> {
        return this.db.select().from(this.table as AnyPgTable)
    }

    public async getById(id: string): Promise<SelectModel<T> | null> {
        const [row] = await this.db
            .select()
            .from(this.table as AnyPgTable)
            .where(eq(this.table.id, id))
            .limit(1)

        return row || null
    }

    public async create(data: InsertModel<T>): Promise<SelectModel<T>> {
        const [inserted] = await this.db.insert(this.table).values(data).returning()
        return inserted
    }

    public async update(id: Uuid, data: UpdateModel<T>): Promise<SelectModel<T>> {
        const [updated] = await this.db
            .update(this.table as AnyPgTable)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(this.table.id, id))
            .returning()
        return updated
    }

    public async delete(id: Uuid): Promise<boolean> {
        const result = await this.db.delete(this.table).where(eq(this.table.id, id))
        return (result?.rowCount ?? 0) > 0
    }
}
