import { UserRole } from "src/users/entities/user.entity";
import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles';
export const ISPUBLICKEY = 'isPublic';
export const Public = () => SetMetadata(ISPUBLICKEY, true);

export const CurrentUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const user = ctx.switchToHttp().getRequest().userAuth;
        console.log(user);

        if (!user) return null;

        return user;
    }
);

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);