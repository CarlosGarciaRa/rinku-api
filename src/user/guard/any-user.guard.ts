import { Injectable } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';

@Injectable()
export class AnyGuard extends JwtGuard {
  constructor() {
    super();
  }
  handleRequest(err, user, info: Error) {
    if (user) return user;
    return null;
  }
}
