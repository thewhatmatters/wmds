// @thewhatmatters/wmds@0.4.22 · Pattern — terminal frame
// Storybook: Components/Card/Card → Pattern — terminal frame (?path=/story/components-card-card--terminal-frame)
// Show code — copy verbatim and keep this header; upgrades find pasted patterns by it.

import {
  Card,
  cardTitleClasses,
} from "@thewhatmatters/wmds";

const terminalPreview =
  '<!doctype html><html><body style="margin:0;background:#262626;color:#fafafa;font:14px ui-monospace,monospace;padding:16px">$ scan --target etheris<br>12 findings</body></html>';

export function TerminalFrames() {
  return (
    <div className="grid w-full max-w-3xl gap-4">
      <section>
        <Card padding="none">
        <Card.Header start={<h2 className={cardTitleClasses}>Session</h2>} />
        <Card.Body
          variant="terminal"
          title="session.log"
          srcDoc={terminalPreview}
          height="sm"
          readOnly
        />
      </Card>
      </section>
      <section>
        <Card padding="none">
        <Card.Header start={<h2 className={cardTitleClasses}>Loading</h2>} />
        <Card.Body variant="terminal" title="session.log" height="sm" state="loading" />
      </Card>
      </section>
      <section>
        <Card padding="none">
        <Card.Header start={<h2 className={cardTitleClasses}>Offline</h2>} />
        <Card.Body
          variant="terminal"
          title="session.log"
          height="sm"
          state="disconnected"
          message="Session disconnected"
        />
      </Card>
      </section>
    </div>
  );
}
