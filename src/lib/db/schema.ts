import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  uuid,
  index,
  primaryKey,
} from 'drizzle-orm/pg-core';

// Better-Auth managed tables ----------------------------------------------

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  providerId: text('provider_id').notNull(),
  accountId: text('account_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// App-specific tables -----------------------------------------------------

export const exams = pgTable('exams', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  fullName: text('full_name').notNull(),
  description: text('description'),
  totalQuestions: integer('total_questions').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  passMarkPercent: integer('pass_mark_percent').notNull(),
  negativeMarking: boolean('negative_marking').default(false).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const topics = pgTable(
  'topics',
  {
    code: text('code').notNull(),
    examCode: text('exam_code')
      .notNull()
      .references(() => exams.code),
    name: text('name').notNull(),
    weightInExam: integer('weight_in_exam'),
    displayOrder: integer('display_order').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.examCode, table.code] }),
  })
);

export const testSets = pgTable('test_sets', {
  id: text('id').primaryKey(),
  examCode: text('exam_code')
    .notNull()
    .references(() => exams.code),
  name: text('name').notNull(),
  description: text('description'),
  // null when set spans multiple topics (mocks, full simulator)
  topicCode: text('topic_code'),
  durationSeconds: integer('duration_seconds').notNull(),
  // Full simulator samples dynamically; row in test_set_questions is empty for these.
  isDynamic: boolean('is_dynamic').default(false).notNull(),
  displayOrder: integer('display_order').notNull(),
});

export const questions = pgTable(
  'questions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    examCode: text('exam_code')
      .notNull()
      .references(() => exams.code),
    topicCode: text('topic_code').notNull(),
    question: text('question').notNull(),
    options: jsonb('options').notNull().$type<string[]>(),
    correctIndex: integer('correct_index').notNull(),
    explanation: text('explanation').notNull(),
    difficulty: integer('difficulty').default(2).notNull(),
  },
  (table) => ({
    examTopicIdx: index('exam_topic_idx').on(table.examCode, table.topicCode),
  })
);

export const testSetQuestions = pgTable(
  'test_set_questions',
  {
    setId: text('set_id')
      .notNull()
      .references(() => testSets.id),
    questionId: uuid('question_id')
      .notNull()
      .references(() => questions.id),
    questionOrder: integer('question_order').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.setId, table.questionId] }),
  })
);

// Per-question response stored in attempts.responses
export type AttemptResponse = {
  questionId: string;
  questionSnapshot: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    topicCode: string;
  };
  userAnswerIndex: number | null;
  isCorrect: boolean;
  markedForReview: boolean;
};

export const attempts = pgTable(
  'attempts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    setId: text('set_id')
      .notNull()
      .references(() => testSets.id),
    examCode: text('exam_code')
      .notNull()
      .references(() => exams.code),
    startedAt: timestamp('started_at').notNull(),
    submittedAt: timestamp('submitted_at').notNull(),
    durationSecondsTaken: integer('duration_seconds_taken').notNull(),
    totalQuestions: integer('total_questions').notNull(),
    attempted: integer('attempted').notNull(),
    correct: integer('correct').notNull(),
    scorePercent: integer('score_percent').notNull(),
    passed: boolean('passed').notNull(),
    responses: jsonb('responses').notNull().$type<AttemptResponse[]>(),
  },
  (table) => ({
    userIdx: index('user_idx').on(table.userId),
    userExamIdx: index('user_exam_idx').on(table.userId, table.examCode),
  })
);
