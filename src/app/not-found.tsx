import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-veyra flex flex-col items-center py-32 text-center md:py-48">
      <p className="eyebrow text-bronze-deep">404</p>
      <h1 className="display mt-5 text-[3.2rem] md:text-[4.8rem]">
        This page has <em>faded.</em>
      </h1>
      <p className="mt-5 max-w-md text-stone">Like the last note of a fragrance, what you were looking for is no longer here.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/shop">Explore the collection</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Return home
        </ButtonLink>
      </div>
    </div>
  );
}
