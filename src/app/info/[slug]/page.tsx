import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { infoPages } from "@/data/pages";

export function generateStaticParams() {
  return infoPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/info/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = infoPages.find((p) => p.slug === slug);
  return page ? { title: page.title, description: page.description, alternates: { canonical: `/info/${slug}` } } : { title: "Not found" };
}

export default function InfoPageRoute({ params }: PageProps<"/info/[slug]">) {
  return (
    <div className="container-veyra grid gap-12 pt-14 pb-28 md:pt-20 lg:grid-cols-12 lg:gap-8">
      <nav aria-label="Client care" className="lg:col-span-3">
        <p className="eyebrow text-stone">Client care</p>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 lg:flex-col">
          {infoPages.map((p) => (
            <li key={p.slug}>
              <Link href={`/info/${p.slug}`} className="text-[0.9375rem] text-stone hover:text-charcoal">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Suspense fallback={<div className="h-96 lg:col-span-7 lg:col-start-5" />}>
        <InfoContent params={params} />
      </Suspense>
    </div>
  );
}

async function InfoContent({ params }: { params: PageProps<"/info/[slug]">["params"] }) {
  const { slug } = await params;
  const page = infoPages.find((p) => p.slug === slug);
  if (!page) notFound();
  return (
    <article className="lg:col-span-7 lg:col-start-5">
      <h1 className="display text-[3.2rem] md:text-[4.5rem]">{page.title}</h1>
      <p className="mt-6 font-serif text-[1.5rem] leading-snug text-ink/85 italic">{page.intro}</p>
      <div className="mt-12 divide-y divide-line border-y border-line">
        {page.sections.map((s) => (
          <section key={s.heading} className="grid gap-3 py-8 md:grid-cols-[14rem_1fr] md:gap-8">
            <h2 className="font-serif text-[1.4rem] leading-tight">{s.heading}</h2>
            <div className="space-y-3 leading-relaxed text-ink/80">
              {s.body.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
