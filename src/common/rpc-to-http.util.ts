import { HttpException, HttpStatus } from '@nestjs/common';
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
 * Awaits a ClientProxy call made from the gateway and converts a peer
 * service's RpcException payload back into the equivalent HttpException,
 * so REST clients keep seeing the original status code (404, 409, etc).
 */
export async function sendRpc<T>(source: Observable<T>): Promise<T> {
  try {
    return await firstValueFrom(source);
  } catch (error) {
    if (isRpcErrorPayload(error)) {
      throw new HttpException(error.message, error.statusCode);
    }
    throw new HttpException(
      'Upstream service error',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
