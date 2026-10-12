create table public.journal_editions (
 number integer primary key check(number>0),
 title text not null,
 accepting_submissions boolean not null default false,
 opened_at date,
 deadline date
);
alter table public.journal_editions enable row level security;
create policy journal_editions_read on public.journal_editions for select to anon,authenticated using(true);
grant select on public.journal_editions to anon,authenticated;
insert into public.journal_editions(number,title,accepting_submissions,opened_at,deadline) values
(1,'Edição inaugural',false,'2026-08-17','2026-10-04'),
(2,'Edição 2',true,'2026-10-12',null);
create unique index journal_editions_one_open on public.journal_editions((accepting_submissions)) where accepting_submissions;
alter table public.submissions add column edition_number integer not null default 1 references public.journal_editions(number);
alter table public.submissions alter column edition_number set default 2;
create index submissions_edition_number_idx on public.submissions(edition_number);
create function public.assign_submission_edition() returns trigger language plpgsql security invoker set search_path=public as $$
begin
 if TG_OP='INSERT' then
  select number into NEW.edition_number from public.journal_editions where accepting_submissions;
  if NEW.edition_number is null then raise exception 'Não há edição aberta para novas submissões.'; end if;
 elsif NEW.edition_number is distinct from OLD.edition_number then
  raise exception 'A edição da submissão não pode ser alterada. Revisões permanecem na edição original.';
 end if;
 return NEW;
end $$;
create trigger submission_edition_guard before insert or update of edition_number on public.submissions for each row execute function public.assign_submission_edition();
create function public.submission_edition_map() returns table(submission_id uuid,edition_number integer,review_ids uuid[])
language sql stable security definer set search_path=public as $$
 select s.id,s.edition_number,
 array(select r.id from public.reviews r join public.review_assignments a on a.id=r.assignment_id
 where a.submission_id=s.id and (public.is_editorial_staff(auth.uid()) or r.reviewer_id=auth.uid()))
 from public.submissions s
 where auth.uid() is not null and (
 public.is_editorial_staff(auth.uid()) or s.author_id=auth.uid()
 or exists(select 1 from public.review_assignments a where a.submission_id=s.id and a.reviewer_id=auth.uid()));
$$;
revoke all on function public.submission_edition_map() from public,anon;
grant execute on function public.submission_edition_map() to authenticated;