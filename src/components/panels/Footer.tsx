import { footer, social } from "@/content/site";
import { Panel } from "@/components/ui/Panel";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Globe } from "@/components/illustrations/Globe";

export function Footer() {
  return (
    <Panel id="footer" theme="ice" width="60cqw" headingId="footer-heading" as="footer">
      <div className="flex flex-col justify-center gap-8 px-8 pt-16 pb-28 hz:h-full hz:px-14 hz:py-16">
        <Globe className="w-[9.5rem]" />
        <h2 id="footer-heading" className="t-display t-panel">
          {footer.heading}
        </h2>
        <ul className="flex gap-3">
          {social.map((s) => (
            <li key={s.key}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} (opens in a new tab)`}
                className="grid size-12 place-items-center border-[1.5px] border-plum transition-colors duration-200 hover:bg-plum hover:text-wasabi"
              >
                <SocialIcon name={s.key} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
