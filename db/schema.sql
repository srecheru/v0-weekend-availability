-- Weekend Availability Board schema for Neon Postgres
--
-- Tables:
--   - boards
--   - participants
--   - busy_weekends

create table if not exists boards (
  id uuid primary key,
  name text not null,
  timezone text not null,
  duration_months integer not null check (duration_months in (1, 3, 6, 12)),
  date_range_start date not null,
  date_range_end date not null,
  participant_cap integer not null default 5,
  join_token text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists participants (
  id uuid primary key,
  board_id uuid not null references boards(id) on delete cascade,
  display_name text not null,
  claim_code text not null,
  state text not null check (
    state in ('JOINED_NOT_INITIATED', 'INITIATED_ZERO_BUSY', 'ADDED_AVAILABILITY')
  ),
  joined_at timestamptz not null default now(),
  last_updated_at timestamptz not null default now()
);

create unique index if not exists participants_board_display_name_idx
  on participants (board_id, lower(display_name));

create unique index if not exists participants_board_claim_code_idx
  on participants (board_id, lower(claim_code));

create table if not exists busy_weekends (
  participant_id uuid not null references participants(id) on delete cascade,
  friday date not null,
  primary key (participant_id, friday)
);

