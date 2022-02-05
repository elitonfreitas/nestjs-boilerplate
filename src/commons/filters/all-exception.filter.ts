import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  getErrorMessages(exception: any): string[] {
    if (exception.toString().includes('email_1 dup key')) {
      return ['Email already exists'];
    }
    if (exception.toString().includes('username_1 dup key')) {
      return ['Username already exists'];
    }

    const { errors } = exception;

    if (!errors) {
      return [exception.message];
    }

    return Object.keys(errors).map((key) => errors[key].properties.message);
  }

  getStatusCode(exception: any): number {
    const errorStackString = exception.toString();
    const errors400 = ['ValidationError'];

    const is400 = errors400.find((errorString) => errorStackString.includes(errorString));

    if (is400) {
      return HttpStatus.PRECONDITION_FAILED;
    }

    return exception.status || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    Logger.error(exception);
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const errors = this.getErrorMessages(exception);
    const statusCode = this.getStatusCode(exception);
    const responseBody = { statusCode, errors };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
