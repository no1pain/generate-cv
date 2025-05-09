# AI Resume Generator

A modern web application that generates professional resumes using AI technology. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- Create professional resumes with AI assistance
- Multiple resume templates
- User authentication and resume history
- Language support (English and Ukrainian)
- Premium features (PDF download)

## Tech Stack

- **Frontend**: Next.js 14+, React 19, Tailwind CSS
- **Authentication**: Supabase Authentication
- **Database**: Supabase PostgreSQL
- **AI**: OpenAI API (optional)

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn
- A Supabase account (free tier available)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/generate-cv.git
   cd generate-cv
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

   # OpenAI configuration (optional)
   OPENAI_API_KEY=your-openai-api-key

   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup

1. Create a new project in [Supabase](https://supabase.com/).
2. Set up authentication providers (Email/Password and Google).
3. Create the following tables in your database:

#### Profiles Table

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  email text
);

-- Create a secure RLS policy for the profiles table
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile." on profiles for update using (auth.uid() = id);
```

#### Resumes Table

```sql
create table resumes (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone,
  title text,
  content text,
  user_id uuid references auth.users not null,
  template text,
  is_public boolean default false
);

-- Create a secure RLS policy for the resumes table
alter table resumes enable row level security;
create policy "Users can view their own resumes." on resumes for select using (auth.uid() = user_id);
create policy "Users can create their own resumes." on resumes for insert with check (auth.uid() = user_id);
create policy "Users can update their own resumes." on resumes for update using (auth.uid() = user_id);
create policy "Users can delete their own resumes." on resumes for delete using (auth.uid() = user_id);
```

4. Set up database triggers for user creation:

```sql
-- Create a trigger to automatically create a profile entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [OpenAI](https://openai.com/)
