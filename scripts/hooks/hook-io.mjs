export async function readHookInput(stream = process.stdin) {
  let text = "";
  for await (const chunk of stream) text += chunk;
  if (!text.trim()) return {};
  const input = JSON.parse(text);
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Hook input must be a JSON object.");
  }
  return input;
}

export function writeHookOutput(output = {}) {
  process.stdout.write(`${JSON.stringify(output)}\n`);
}

export function contextOutput(eventName, additionalContext, systemMessage) {
  return {
    ...(systemMessage ? { systemMessage } : {}),
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext,
    },
  };
}

export function denyPreToolUse(reason) {
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  };
}

export function blockOutput(reason, systemMessage) {
  return {
    decision: "block",
    reason,
    ...(systemMessage ? { systemMessage } : {}),
  };
}
