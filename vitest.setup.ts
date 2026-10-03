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
