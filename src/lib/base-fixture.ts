import type { DbClient } from '@/db/client'
import { inArray, type ColumnBaseConfig } from 'drizzle-orm'
import type { AnyPgTable, PgColumn } from 'drizzle-orm/pg-core'

type SelectModel<T extends AnyPgTable> = T['$inferSelect']
export abstract class BaseFixture<
    T extends AnyPgTable & {
        id: PgColumn<ColumnBaseConfig<'string', 'PgUUID'>>
    },
> {
    public async seedRecords(db: DbClient) {
        const result = await db.insert(this.schema).values(Object.values(this.data))
        console.log(result)
        return result
    }

    public async clearRecords(db: DbClient) {
        await db.delete(this.schema).where(
            inArray(
                this.schema.id,
                Object.values(this.data).map((d) => d.id),
            ),
        )
    }

    public abstract schema: T
    public abstract data: Record<string, SelectModel<T>>
}
