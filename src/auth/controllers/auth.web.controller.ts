import { Body, Controller, Get, Post, Render } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { LoginDto } from "../dto/login-dto";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Get('login')
    @Render('login')
    loginGet(){
        let message
        return { message }
    }


    @Post('login')
    login(@Body() loginDto:LoginDto) {
        console.log(loginDto)
        return this.authService.login(loginDto)
    }

}
