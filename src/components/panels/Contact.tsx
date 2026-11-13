import { contact, person, social } from "@/content/site";
import { withBase } from "@/lib/assets";
import { Panel } from "@/components/ui/Panel";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Terminal } from "@/components/illustrations/Terminal";

export function Contact({ hasResume }: { hasResume: boolean }) {
  const links = [
    ...social.map((s) => ({ label: s.label, href: s.href, external: true })),
    ...(hasResume ? [{ label: contact.resumeLabel, href: withBase(person.resumePath), external: true }] : []),
  ];

  return (
    <Panel id="contact" theme="plum" width="100cqw" headingId="contact-heading">
      <div className="grid gap-14 px-8 pt-20 pb-20 sm:px-12 hz:h-full hz:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] hz:items-center hz:gap-16 hz:px-16">
        <div data-parallax="0.06" className="mx-auto w-full max-w-[34rem]">
          <Terminal className="w-full" />
        </div>

        <div data-reveal>
          <h2 id="contact-heading" data-reveal-item className="t-display t-panel text-wasabi">
            {contact.heading}
          </h2>
          <p data-reveal-item className="t-body mt-5 text-ice">
            {contact.body}
          </p>

          <div data-reveal-item className="mt-9 flex flex-wrap items-stretch gap-3">
            <a
              href={`mailto:${person.email}`}
              className="btn min-h-12 px-4 py-4 text-[0.8rem] normal-case sm:px-5 sm:text-[1.05rem]"
            >
              <span>{person.email}</span>
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </a>
            <CopyEmail email={person.email} label={contact.copyLabel} toast={contact.copiedToast} />
          </div>

          <ul data-reveal-item className="t-mono mt-10 flex flex-wrap gap-x-6 gap-y-3 uppercase">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ice underline decoration-[1.5px] underline-offset-[4px] hover:text-wasabi"
                >
                  {link.label} <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}
