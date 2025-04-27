import { HttpException, HttpStatus, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { DefaultResponse } from '@orders-app/types'; 

export class BaseController {
  protected readonly logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  handleUnauthorized(@Res() res: Response, message?: string) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: message || 'Unauthorized',
    });
  }

  handleBadRequest(@Res() res: Response, message?: string, rc = 0) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: message || 'Bad request',
      rc,
    });
  }

  handleOkRequest<T = unknown>(
    @Res() res: Response,
    data?: T,
    message?: string,
  ) {
    return res.status(HttpStatus.OK).json({
      message: message || 'Success',
      data: data ?? DefaultResponse.Success,
    });
  }

  handleSimpleOkRequest<T = unknown>(data: T, message?: string) {
    return {
      message: message || 'Success',
      data,
    };
  }

  handleSimpleBadRequest(message?: string, rc = 0) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: message || 'Bad request',
        rc,
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  handleServerError(@Res() res: Response, message?: string) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: message || 'Internal server error',
    });
  }

  handleNotFound(@Res() res: Response, message?: string) {
    return res.status(HttpStatus.NOT_FOUND).json({
      message: message || 'Not found',
    });
  }
}
