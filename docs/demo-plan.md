# Demo Plan

## Çka është projekti dhe kujt i shërben
Ky projekt është një aplikacion web për validimin e ideve të biznesit duke përdorur AI.  
Shërben për studentë, sipërmarrës dhe kushdo që dëshiron feedback të shpejtë mbi një ide.

## Flow kryesor që do ta demonstroj
1. Përdoruesi shkruan një ide në textarea.
2. Klikon "Validate Idea".
3. Shfaqet loading state me "Analyzing…".
4. Butoni është disabled gjatë analizës.
5. Shfaqet përgjigjja e AI dhe ruhet në histori.
6. Përdoruesi mund të shohë historinë për 30 ditët e fundit.

## Pjesët teknike që do t’i shpjegoj shkurt
- Supabase si database dhe auth.
- API route `/api/validate` që thërret AI.
- Row Level Security dhe ruajtja e ideve.
- Refaktorimi i kodit (lib/AiClient.ts, lib/supabase.ts).

## Çfarë kam kontrolluar para demos
- Live URL në Vercel funksionon pa error.
- GitHub repo ka commit‑et e fundit.
- README është i përditësuar.
- Flow kryesor punon: insert, validate, history, delete.

## Plan B nëse live demo dështon
- Do të përdor video/screenshot të flow‑it kryesor.
- Do të tregoj kodin në GitHub dhe commit‑et.
- Do të shpjegoj logjikën e API‑ve dhe Supabase.

