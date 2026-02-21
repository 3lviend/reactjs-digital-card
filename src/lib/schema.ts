import { Schema, Table, column } from '@powersync/web';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const digitalCardsTable = new Table({
  digital_card_name: column.text,
  full_name: column.text,
  first_name: column.text,
  middle_name: column.text,
  last_name: column.text,
  prefix: column.text,
  suffix: column.text,
  accreditations: column.text,
  preferred_name: column.text,
  title: column.text,
  department: column.text,
  company: column.text,
  headline: column.text,
  background_url: column.text,
  avatar_url: column.text,
  contact_type: column.text,
  digital_card_url: column.text,
  notes: column.text,
  qr_code: column.text,
  created_at: column.text,
  is_public: column.integer, // booleans are stored as int in sqlite
  user_id: column.text,
  theme: column.text,
  social_media: column.text,
});

export const AppSchema = new Schema({
  digital_cards: digitalCardsTable
});

// Drizzle ORM Schema mapping for queries

export const digital_cards = sqliteTable('digital_cards', {
  id: text('id').primaryKey(),
  digital_card_name: text('digital_card_name'),
  full_name: text('full_name'),
  first_name: text('first_name'),
  middle_name: text('middle_name'),
  last_name: text('last_name'),
  prefix: text('prefix'),
  suffix: text('suffix'),
  accreditations: text('accreditations'),
  preferred_name: text('preferred_name'),
  title: text('title'),
  department: text('department'),
  company: text('company'),
  headline: text('headline'),
  background_url: text('background_url'),
  avatar_url: text('avatar_url'),
  contact_type: text('contact_type'),
  digital_card_url: text('digital_card_url'),
  notes: text('notes'),
  qr_code: text('qr_code'),
  created_at: text('created_at'),
  is_public: integer('is_public', { mode: 'boolean' }),
  user_id: text('user_id'),
  theme: text('theme'),
  social_media: text('social_media'),
});
