
/*
 * GILARIS AI — MULTI-AI FOUNDATION
 * MODULE 01: PROVIDER REGISTRY
 *
 * Version: 1.0.0
 *
 * Tanjona:
 * - Mitahiry ny lisitry ny AI providers.
 * - Mamaritra ny capabilities an'ny provider tsirairay.
 * - Mamantatra raha voa-configure sy azo ampiasaina izy.
 *
 * SECURITY:
 * - Tsy mamoaka API keys.
 * - Tsy miantso API.
 * - Tsy manova ny Worker production.
 * - Tsy mampandeha provider raha tsy enable = true.
 */

// ============================================================
// 1. PROVIDER DEFINITIONS
// ============================================================

const PROVIDER_DEFINITIONS = Object.freeze({

  groq: {
    id: "groq",
    name: "Groq",
    category: "inference",
    capabilities: ["chat", "fast-inference"],
    defaultEnabled: false
  },

  openai: {
    id: "openai",
    name: "OpenAI",
    category: "general",
    capabilities: ["chat", "reasoning", "vision", "tools"],
    defaultEnabled: false
  },

  gemini: {
    id: "gemini",
    name: "Google Gemini",
    category: "general",
    capabilities: ["chat", "reasoning", "vision", "tools"],
    defaultEnabled: false
  },

  anthropic: {
    id: "anthropic",
    name: "Anthropic Claude",
    category: "general",
    capabilities: ["chat", "reasoning", "vision", "tools"],
    defaultEnabled: false
  },

  deepseek: {
    id: "deepseek",
    name: "DeepSeek",
    category: "reasoning",
    capabilities: ["chat", "reasoning", "code"],
    defaultEnabled: false
  },

  mistral: {
    id: "mistral",
    name: "Mistral AI",
    category: "general",
    capabilities: ["chat", "reasoning", "code", "tools"],
    defaultEnabled: false
  }

});


// ============================================================
// 2. SAFE PROVIDER CONFIGURATION
// ============================================================

function normalizeProviderConfig(config = {}) {

  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw new TypeError("Provider configuration must be an object.");
  }

  return config;
}


// ============================================================
// 3. BUILD PROVIDER REGISTRY
// ============================================================

export function createProviderRegistry(config = {}) {

  const safeConfig = normalizeProviderConfig(config);

  const providers = Object.values(PROVIDER_DEFINITIONS).map(definition => {

    const supplied = safeConfig[definition.id] || {};

    const enabled = supplied.enabled === true;

    const hasApiKey =
      typeof supplied.apiKey === "string" &&
      supplied.apiKey.trim().length > 0;

    const hasModel =
      typeof supplied.model === "string" &&
      supplied.model.trim().length > 0;

    const configured = hasApiKey && hasModel;

    return Object.freeze({

      id: definition.id,
      name: definition.name,
      category: definition.category,

      capabilities: [...definition.capabilities],

      enabled,
      configured,

      available: enabled && configured,

      model: hasModel ? supplied.model.trim() : null,

      status: !enabled
        ? "disabled"
        : !configured
          ? "not_configured"
          : "ready"

    });

  });

  return Object.freeze(providers);
}


// ============================================================
// 4. GET ONE PROVIDER
// ============================================================

export function getProvider(registry, providerId) {

  if (!Array.isArray(registry)) {
    throw new TypeError("Invalid provider registry.");
  }

  return registry.find(provider => provider.id === providerId) || null;
}


// ============================================================
// 5. GET AVAILABLE PROVIDERS
// ============================================================

export function getAvailableProviders(registry) {

  if (!Array.isArray(registry)) {
    throw new TypeError("Invalid provider registry.");
  }

  return registry.filter(provider => provider.available === true);
}


// ============================================================
// 6. CHECK PROVIDER CAPABILITY
// ============================================================

export function providerSupports(registry, providerId, capability) {

  const provider = getProvider(registry, providerId);

  if (!provider || !provider.available) {
    return false;
  }

  return provider.capabilities.includes(capability);
}


// ============================================================
// 7. SAFE PUBLIC STATUS
// ============================================================

export function getProviderStatus(registry) {

  if (!Array.isArray(registry)) {
    throw new TypeError("Invalid provider registry.");
  }

  return registry.map(provider => ({

    id: provider.id,
    name: provider.name,
    status: provider.status,
    available: provider.available,
    model: provider.model,
    capabilities: [...provider.capabilities]

  }));
 }
