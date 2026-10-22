/**
 * Unit tests never load the Rive runtime.
 *
 * A test that renders a real RiveHand would otherwise fetch the runtime WASM over the
 * network, which makes the run depend on the network and can keep a worker alive after it.
 * The request stays pending instead, so the hand behaves as it does before the runtime is ready.
 */
const realFetch = globalThis.fetch;

globalThis.fetch = (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (url.endsWith(".wasm")) return new Promise<Response>(() => {});
  return realFetch(input, init);
};

/**
 * Node 25+ ships its own `localStorage`, `sessionStorage`, and `Storage` globals (`localStorage` is
 * undefined unless Node runs with `--localstorage-file`). Vitest's DOM environment skips any global
 * Node already defines, so happy-dom tests got Node's storage instead of the DOM's. Put the DOM's
 * back. On older Node the environment already installed happy-dom's, and this changes nothing.
 */
if ("happyDOM" in globalThis) {
  const { Storage: DomStorage } = await import("happy-dom");
  const install = (key: string, value: unknown) =>
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
  if (globalThis.Storage !== (DomStorage as unknown)) install("Storage", DomStorage);
  for (const key of ["localStorage", "sessionStorage"] as const) {
    if (!(globalThis[key] instanceof DomStorage)) install(key, new DomStorage());
  }
}
