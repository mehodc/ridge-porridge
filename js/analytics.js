/**
 * Point d'entrée analytics — à connecter plus tard à un vrai provider.
 */
function trackEvent(name, data) {
  // eslint-disable-next-line no-console
  console.log("[analytics]", name, data || {});
}
