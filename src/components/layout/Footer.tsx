import Link from "next/link";
import { brand } from "@/config/brand";
import { Newsletter } from "./Newsletter";

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory">
      <div className="container-veyra grid gap-16 py-20 md:py-28 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <Newsletter />
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {brand.nav.footer.map((group) => (
            <div key={group.title}>
              <h2 className="eyebrow text-ivory/50">{group.title}</h2>
              <ul className="mt-5 space-y-3">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[0.9375rem] text-ivory/85 transition-colors hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="container-veyra">
        <p className="display select-none border-t border-ivory/15 pt-10 text-center text-[13.5vw] leading-none tracking-[0.06em] text-ivory/90 md:text-[11vw]" aria-hidden>
          Veyra
        </p>
      </div>
      <div className="container-veyra flex flex-col gap-4 py-8 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
        <p>
          © {2026} {brand.name}. A fictional brand created as a design and engineering concept.
        </p>
        <p>
          {brand.social.join(" · ")} <span className="text-ivory/65">— accounts linked at launch</span>
        </p>
      </div>
    </footer>
  );
}
