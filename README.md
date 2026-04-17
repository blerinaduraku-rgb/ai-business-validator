This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






## Implementimi i Design Patterns

Në këtë fazë të projektit, kam aplikuar dy design patterns për të rritur profesionalizmin dhe shkallëzueshmërinë e kodit.

### 1. Singleton Pattern
- **Skedari:** `lib/AiClient.ts`
- **Pse:** Siguron që aplikacioni të ketë vetëm një instancë të hapur për komunikim me API-në e Hugging Face. Kjo parandalon përdorimin e tepërt të memories dhe menaxhon çelësat e sigurisë në një pikë të vetme.

### 2. Factory Pattern
- **Skedari:** `lib/ReportFactory.ts`
- **Pse:** Mundëson krijimin e objekteve të raporteve të ndryshme (si `QuickReport` ose `DetailedReport`) në mënyrë dinamike bazuar në kërkesën e përdoruesit, pa ndryshuar logjikën kryesore të frontend-it.

---

## 📝 Reflektimi mbi Design Patterns (Detyra 4)

Zbatimi i Design Patterns në projektin tim "Business Idea Validator" nuk ishte vetëm një ushtrim akademik, por një domosdoshmëri për të siguruar pastërtinë dhe performancën e kodit. Unë zgjodha **Singleton** dhe **Factory** sepse ato zgjidhin probleme reale në arkitekturën e një aplikacioni modern që bazohet në AI.

Në projekte reale, **Singleton Pattern** është kritik kur punojmë me burime të jashtme të kufizuara. Për shembull, nëse ky aplikacion do të kishte mijëra përdorues, pa Singleton, çdo kërkesë mund të krijonte një objekt të ri lidhjeje, duke shkaktuar "memory leaks" dhe ngadalësim të serverit. Unë do ta përdorja këtë pattern në çdo skenar ku kemi të bëjmë me Database Connections, Logging Services, ose Configuration Managers, ku një instancë e vetme shërben si "burimi i vetëm i së vërtetës".

Nga ana tjetër, **Factory Pattern** është i pazëvendësueshëm në sisteme që pritet të rriten. Në këtë projekt, nëse në të ardhmen vendos të shtoj validime specifike për industri të ndryshme (p.sh. një raport specifik për Fintech dhe një tjetër për E-commerce), Factory më lejon t'i shtoj këto pa "thyer" kodin ekzistues. Kjo ndjek parimin "Open/Closed" të SOLID, ku kodi është i hapur për t'u zgjeruar por i mbyllur për t'u modifikuar. Në një ambient pune real, ky pattern përdoret shpesh në UI component libraries, sistemet e pagesave (ku Factory zgjedh mes PayPal, Stripe, apo Crypto) dhe në gjenerimin e dokumenteve të formateve të ndryshme. Këto patterns e kthejnë një script të thjeshtë në një sistem profesional të shkallëzueshëm.

---
