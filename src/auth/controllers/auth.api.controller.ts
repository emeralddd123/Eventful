import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { LoginDto } from "../dto/login-dto";


@Controller('api/v1/auth')
export class AuthApiController {
    constructor(private readonly authService: AuthService){}

    @Post('login')
    login(@Body() loginDto:LoginDto) {
        return this.authService.login(loginDto)
    }

}
