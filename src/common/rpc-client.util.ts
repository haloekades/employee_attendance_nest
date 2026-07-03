import { RpcException } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

interface RpcErrorPayload {
  statusCode: number;
  message: string;
}

function isRpcErrorPayload(error: unknown): error is RpcErrorPayload {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error
  );
}

/**
 * Awaits a ClientProxy call made from inside another microservice's handler.
 * Re-wraps the peer's error payload as an RpcException so it keeps propagating
 * with the original status code/message instead of surfacing as a generic 500.
 */
export async function callMicroservice<T>(source: Observable<T>): Promise<T> {
  try {
    return await firstValueFrom(source);
  } catch (error) {
    if (isRpcErrorPayload(error)) {
      throw new RpcException(error);
    }
    throw error;
  }
}
