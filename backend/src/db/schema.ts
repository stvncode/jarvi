import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const historyEntriesTypes = pgTable('historyentries_types', {
  value: text('value').primaryKey().notNull(),
});

export const historyEntries = pgTable('historyentries', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  profileId: uuid('profile_id'),
  userId: uuid('user_id').notNull(),
  type: text('type').notNull().references(() => historyEntriesTypes.value, { onDelete: 'set null', onUpdate: 'cascade' }),
  data: jsonb('data'),
  message: text('message'),
  metadata: jsonb('metadata'),
  isRead: boolean('is_read'),
  subject: text('subject'),
  externalId: text('external_id'),
  externalThreadId: text('external_thread_id'),
  eventStartAt: timestamp('event_start_at', { withTimezone: true }),
  eventEndAt: timestamp('event_end_at', { withTimezone: true }),
  senderUserId: uuid('sender_user_id'),
  linkedinSeatId: integer('linkedin_seat_id'),
  isManuallyCreated: boolean('is_manually_created').notNull().default(false),
  messageScheduledId: uuid('message_scheduled_id'),
  triggerHasBeenRepliedTo: boolean('trigger_has_been_replied_to'),
});

export type HistoryEntry = typeof historyEntries.$inferSelect;
export type NewHistoryEntry = typeof historyEntries.$inferInsert;
export type HistoryEntryType = typeof historyEntriesTypes.$inferSelect; 