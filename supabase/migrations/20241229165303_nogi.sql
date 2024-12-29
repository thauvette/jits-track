alter table "public"."Rolls" add column "nogi" boolean not null default false;

create policy "Allow updates to owned rows"
on "public"."Teammates"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



