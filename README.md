# Running
## Supabase setup 

- Login to supabase. `npx supabase login` will open a browser to login.
- Run `npx supabase link --project-ref <project-id>` [this](https://supabase.com/docs/guides/local-development/overview#link-your-project)
  - enter your db password. 
- Run `npx supabase db pull` - unless you're going to attach this to a new supabase project
- Run `npx supabase start` - this can take a while the first time and needs docker running. 
- use the output to fill out your .env.local file
    ```
    VITE_SUPABASE_URL= API URL
    VITE_SUPABASE_PUB_KEY= anon key
    ```

## Running the app
- After completing the above setup
  - `npm install`
  - `npm run dev`

## Supabase migrations 
- When making changes to local DB run `npx supabase db diff -f descriptive_name`
- Then `npx supabase db push`


There is currently no seed file and the app is invite only. 
You'll need "invite" a user in the Studio URL, probably http://127.0.0.1:54323, see output of `npx supabase start`
The "email" will go to Inbucket URL from the `npx supabase start` output

#  TODOs: 
- ux is still very rough
- calendar view? 
- PWA 
- export sessions as csv 
