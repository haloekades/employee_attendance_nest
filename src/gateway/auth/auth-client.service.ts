import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_PATTERNS } from '../../common/message-patterns';
import { sendRpc } from '../../common/rpc-to-http.util';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthClientService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  login(loginDto: LoginDto) {
    return sendRpc(this.client.send(AUTH_PATTERNS.LOGIN, loginDto));
  }
}
