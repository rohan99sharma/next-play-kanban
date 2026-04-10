-- EXTENSIONS
create extension if not exists "uuid-ossp";


-- =============================================
-- LABELS
-- =============================================
create table labels (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  color       text not null default '#6366f1',
  created_at  timestamptz not null default now(),

  unique(user_id, name)
);

alter table labels enable row level security;

create policy "Users manage own labels"
  on labels for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- =============================================
-- TEAM MEMBERS
-- =============================================
create table team_members (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  avatar_url  text,
  email       text,
  created_at  timestamptz not null default now()
);

alter table team_members enable row level security;

create policy "Users manage own team"
  on team_members for all
  using  (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);


-- =============================================
-- TASKS
-- =============================================
create table tasks (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  status      text not null default 'todo'
              check (status in ('todo','in_progress','in_review','done')),
  priority    text not null default 'normal'
              check (priority in ('low','normal','high')),
  due_date    date,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table tasks enable row level security;

create policy "Users manage own tasks"
  on tasks for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tasks_updated_at
  before update on tasks
  for each row execute function update_updated_at();


-- =============================================
-- TASK ↔ LABEL (junction)
-- =============================================
create table task_labels (
  task_id   uuid not null references tasks(id) on delete cascade,
  label_id  uuid not null references labels(id) on delete cascade,
  primary key (task_id, label_id)
);

alter table task_labels enable row level security;

create policy "Users manage own task_labels"
  on task_labels for all
  using (
    exists (
      select 1 from tasks
      where tasks.id = task_labels.task_id
        and tasks.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from tasks
      where tasks.id = task_labels.task_id
        and tasks.user_id = auth.uid()
    )
  );


-- =============================================
-- TASK ↔ TEAM MEMBER ASSIGNMENTS (junction)
-- =============================================
create table task_assignments (
  task_id         uuid not null references tasks(id) on delete cascade,
  team_member_id  uuid not null references team_members(id) on delete cascade,
  primary key (task_id, team_member_id)
);

alter table task_assignments enable row level security;

create policy "Users manage own task_assignments"
  on task_assignments for all
  using (
    exists (
      select 1 from tasks
      where tasks.id = task_assignments.task_id
        and tasks.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from tasks
      where tasks.id = task_assignments.task_id
        and tasks.user_id = auth.uid()
    )
  );


-- =============================================
-- COMMENTS
-- =============================================
create table comments (
  id          uuid primary key default uuid_generate_v4(),
  task_id     uuid not null references tasks(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now()
);

alter table comments enable row level security;

create policy "Users manage own comments"
  on comments for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- =============================================
-- ACTIVITY LOG
-- =============================================
create table activity_log (
  id          uuid primary key default uuid_generate_v4(),
  task_id     uuid not null references tasks(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  event_type  text not null,
  from_value  text,
  to_value    text,
  created_at  timestamptz not null default now()
);

alter table activity_log enable row level security;

create policy "Users see own activity"
  on activity_log for select
  using (auth.uid() = user_id);

create policy "Users insert own activity"
  on activity_log for insert
  with check (auth.uid() = user_id);


-- =============================================
-- INDEXES
-- =============================================
create index tasks_user_status   on tasks(user_id, status);
create index tasks_user_due      on tasks(user_id, due_date);
create index comments_task       on comments(task_id, created_at);
create index activity_task       on activity_log(task_id, created_at);
create index task_labels_task    on task_labels(task_id);
create index task_assign_task    on task_assignments(task_id);


