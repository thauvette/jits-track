create policy "Allow update based on user id"
on "public"."Rolls"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = owner_id));


create policy "Enable delete for users based on user_id"
on "public"."Subs_against"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable delete for users based on user_id"
on "public"."Subs_for"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));



