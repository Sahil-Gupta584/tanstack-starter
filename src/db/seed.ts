import { db } from '#/db'
import { todo } from './schema.js'

async function main() {
  console.log('🌱 Seeding database (drizzle)...')

  await db.delete(todo)

  const inserted = await db
    .insert(todo)
    .values([{ title: 'Buy groceries' }, { title: 'Read a book' }, { title: 'Workout' }])
    .returning()

  console.log(`✅ Created ${inserted.length} todos`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
