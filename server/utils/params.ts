import type { H3Event } from 'h3';

export function getParamId(
  event: H3Event,
  errorMessage = 'ID inválido ou não informado.',
  paramName = 'id'
): number {
  const id = parseInt(event.context.params?.[paramName] || '', 10);

  if (!id || Number.isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: errorMessage,
    });
  }

  return id;
}
