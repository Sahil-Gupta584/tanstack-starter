import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  integer,
  varchar,
} from 'drizzle-orm/pg-core'

// keep unified - single source for all tables, mirrors prisma/schema.prisma

export const subscriptionStatusEnum = pgEnum('SubscriptionStatus', [
  'active',
  'cancelled',
  'expired',
  'on_hold',
])

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('emailVerified').notNull().default(false),
    image: text('image'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (t) => [],
)

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    expiresAt: timestamp('expiresAt').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (t) => [index('session_userId_idx').on(t.userId)],
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (t) => [index('account_userId_idx').on(t.userId)],
)

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (t) => [index('verification_identifier_idx').on(t.identifier)],
)

export const subscription = pgTable(
  'subscription',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    dodoSubscriptionId: text('dodoSubscriptionId').notNull().unique(),
    dodoCustomerId: text('dodoCustomerId'),
    productId: text('productId').notNull(),
    status: subscriptionStatusEnum('status').notNull().default('active'),
    planId: text('planId').notNull().default('starter'),
    billingInterval: text('billingInterval').notNull().default('monthly'),
    currentPeriodEnd: timestamp('currentPeriodEnd'),
    cancelAtNextBilling: boolean('cancelAtNextBilling').notNull().default(false),
    trialEndsAt: timestamp('trialEndsAt'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (t) => [index('subscription_userId_idx').on(t.userId)],
)

export const form = pgTable(
  'form',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    title: text('title').notNull(),
    description: text('description'),
    preset: text('preset').notNull().default('amazon'),
    fields: jsonb('fields').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (t) => [index('form_userId_idx').on(t.userId)],
)

export const formSubmission = pgTable(
  'form_submission',
  {
    id: text('id').primaryKey().$defaultFn(() => createId()),
    formId: text('formId')
      .notNull()
      .references(() => form.id, { onDelete: 'cascade' }),
    data: jsonb('data').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (t) => [index('form_submission_formId_idx').on(t.formId)],
)

export const todo = pgTable('Todo', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// relations - keeps drizzle query includes unified
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  subscriptions: many(subscription),
  forms: many(form),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}))

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  user: one(user, { fields: [subscription.userId], references: [user.id] }),
}))

export const formRelations = relations(form, ({ one, many }) => ({
  user: one(user, { fields: [form.userId], references: [user.id] }),
  submissions: many(formSubmission),
}))

export const formSubmissionRelations = relations(formSubmission, ({ one }) => ({
  form: one(form, { fields: [formSubmission.formId], references: [form.id] }),
}))
