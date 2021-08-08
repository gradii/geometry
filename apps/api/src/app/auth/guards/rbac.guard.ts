import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { difference } from 'ramda';

@Injectable()
export class RbacGuard implements CanActivate {
  // role[用户角色]: 0-超级管理员 | 1-管理员 | 2-开发&测试&运营 | 3-普通用户（只能查看）
  constructor(
    private readonly permissionCodes: string[] = []
    // private readonly role: number
  ) {
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (this.permissionCodes.length > 0) {
      const rst = difference(this.permissionCodes, user.permissionCodes || []);
      if (rst.length < this.permissionCodes.length) {
        return true;
      } else {
        throw new ForbiddenException(`对不起，您无权操作, 需要以下 ${this.permissionCodes.join(',')} 的一个权限码`);
      }
    }
    // if (user.role > this.role) {
    //   throw new ForbiddenException('对不起，您无权操作');
    // }
    return true;
  }
}
