import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IUserPayload, roles } from 'src/common/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // get permitted roles list (from decorator)
    const permitedRoles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log("permitedRoles", permitedRoles)
    if (!permitedRoles) {
      return true;
    }

    // get bearer token (jwt)
    const ctx = context.switchToHttp();
    const token = ctx.getRequest().headers['authorization'];

    // decode jwt token to find user role
    const decodedPayload: IUserPayload = this.jwtService.decode(token.split(' ')[1]) as IUserPayload;
    const userRole: roles = decodedPayload.role;
    console.log("userRole", userRole)

    return matchRoles(permitedRoles, userRole);
  }
}

// check if user role is permited
function matchRoles(permitedRoles: string[], userRol: roles): boolean {
  return permitedRoles.includes(userRol) ? true : false;
}
