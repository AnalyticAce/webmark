import Link from "next/link";

const links = ["How it works", "Features", "Self-host", "Pricing", "FAQ"];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white text-text">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center gap-8 px-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5 text-[22px] font-bold tracking-tight">
          <span className="size-6 rounded-md bg-accent" aria-hidden />
          webmark
        </Link>
        <ul className="ml-auto hidden items-center gap-7 text-[15px] font-medium md:flex">
          {links.map((l) => (
            <li key={l}>
              <Link
                href="#"
                className="text-text-mute transition-colors duration-150 hover:text-text"
              >
                {l}
              </Link>
            </li>
          ))}
          <li>
            <Link href="#" className="text-text-mute transition-colors duration-150 hover:text-text">
              Sign in
            </Link>
          </li>
        </ul>
        <Link
          href="#"
          className="ml-auto flex h-11 items-center rounded-full bg-accent px-5 text-[15px] font-bold text-on-accent transition-colors duration-150 hover:bg-accent-hover md:ml-0"
        >
          Sign up free
        </Link>
      </nav>
    </header>
  );
}
