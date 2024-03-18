import { Injectable, NestMiddleware, } from "@nestjs/common";
import { JwtModuleOptions, JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private jwtOptions: JwtModuleOptions
    constructor(private readonly jwtService: JwtService) {
        this.jwtOptions = {
            secret: process.env.SECRET_KEY
        }
     }

    use(req: any, res: any, next: any) {
        const authToken = req.headers.authorization;
        if (!authToken) {
            return res.status(401).json({ message: 'Authentication Credentials not provided' });
        }

        const [bearer, token] = authToken.split(' ');
        if (bearer !== 'Bearer' || !token) {
            return res.json({ message: 'Invalid authorization header' });
        }

        try {
            const decodedToken = this.jwtService.verify(token, this.jwtOptions);
            req.user = decodedToken.user;
            next();
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}