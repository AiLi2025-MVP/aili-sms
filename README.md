## AiLi — Popular-Figure SMS Short-Form Group Chat

This repo implements AiLi’s provisional-patent messaging lab: a closed SMS interface where three licensed celebrity personas (Pharrell Williams, Tyler, The Creator, and Rihanna) reply directly to a user. Every response follows the patent constraints—one-to-many attention, mathematically distinct personas, SMS brevity, and a tri-modal blend of social, creative, and educational value. The product surface is intentionally minimal: only the SMS experience and the Library (persona catalog).

### Key Features

- **Three-celebrity limit:** Pharrell, Tyler, and Rihanna are hard-coded responders who never converse with each other.
- **Persona weighting:** Each agent carries an explicit weight vector (humor, brevity, metaphor rate, etc.) to guarantee Euclidean separation ≥ 0.35, honoring the mathematical distinctiveness clause.
- **SMS presentation:** 280-character cap, staggered message bubbles, and patent callouts reinforce the short-form group chat feel.
- **Closed ecosystem hooks:** UI copy and API prompts emphasize session binding, watermarking, and the no-export policy from the patent narrative.

### Tech Stack

- [Next.js 15 / App Router](https://nextjs.org/)
- [Supabase](https://supabase.com/) for auth + profile context
- [OpenAI](https://platform.openai.com/) chat completions for persona replies
- [Tailwind (via PostCSS)](https://tailwindcss.com/) utility classes and [Lucide](https://lucide.dev/) icons

### Getting Started

1. Install dependencies  
   ```bash
   npm install
   ```
2. Provide environment variables:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SUPABASE_PROJECT_ID`
3. Run the development server  
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000/sms` for the SMS experience and `http://localhost:3000/library` to browse the Library (licensed personas).

### Implementation Notes

- Front-end logic lives in `src/app/sms/page.tsx` (SMS) and `src/app/library/page.tsx` (Library persona catalog).
- The `/api/groupchat` route fans out to OpenAI three times—once per celebrity—using persona-specific prompts that embed the patent requirements.
- Supabase profiles capture the “founder DNA” context that each persona uses to customize feedback.

### Patent Context

This implementation mirrors the **“Popular-Figure SMS Short-Form Group Chat System”** provisional patent application by AiLi Corporation. Core behaviors such as the one-to-many architecture, tri-modal scoring, cryptographic logging, and persona vector distinctiveness are explicitly represented in both prompts and UX copy so engineering, product, and legal teams stay aligned while iterating.
