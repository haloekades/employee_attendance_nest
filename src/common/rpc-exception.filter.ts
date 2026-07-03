import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

// Terminal filter: whatever this returns is serialized straight onto the
// transport, so it must emit the plain {statusCode, message} payload rather
// than an RpcException instance (RpcException is only auto-unwrapped by
// Nest's *default* handler, which this filter replaces for HttpExceptions).
@Catch(HttpException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException): Observable<never> {
    const statusCode = exception.getStatus();
    const response = exception.getResponse();
    const message =
      typeof response === 'string'
        ? response
        : ((response as { message?: string }).message ?? exception.message);

    return throwError(() => ({ statusCode, message }));
  }
}
