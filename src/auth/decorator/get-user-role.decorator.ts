import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserRole = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.role;
  },
);
