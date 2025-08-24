// Simple LLM adapter (OpenAI-compatible)
// Utilise la clé dans Vite: VITE_OPENAI_API_KEY

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `Tu es l'assistant pédagogique DOREMI.
Réponds toujours en français, de manière claire, concise et utile.
Si une question concerne la plateforme (cours, médiathèque, premium, stages, actualités, paramètres), propose la navigation ou les étapes exactes.
Si tu ne sais pas, dis-le honnêtement puis propose une piste.
`;

export async function askLLM(prompt: string, history: ChatMessage[] = [], abortSignal?: AbortSignal): Promise<string> {
  const apiKey = import.meta?.env?.VITE_OPENAI_API_KEY as string | undefined;
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.filter(m => m.role !== 'system'),
    { role: 'user', content: prompt },
  ];

  const body = {
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.4,
    max_tokens: 512,
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: abortSignal,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const answer = data?.choices?.[0]?.message?.content?.trim?.();
  if (!answer) throw new Error('EMPTY_RESPONSE');
  return answer;
}








