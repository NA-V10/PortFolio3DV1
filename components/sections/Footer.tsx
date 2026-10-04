import { profile } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="shell grid gap-10 py-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <p className="text-lg font-medium tracking-[-0.01em]">NAVEEN B</p>
          <p className="body mt-2 text-sm">
            {profile.role}
            <br />
            {profile.specialization}
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-4">
          <ul className="eyebrow flex flex-wrap gap-6">
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                LinkedIn
              </a>
            </li>
          </ul>
        </nav>
        <p className="eyebrow md:col-span-2 md:text-right">© 2026 Naveen B</p>
      </div>
    </footer>
  );
}
