import { Body, Controller, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly _authServices: AuthService){}

    @Post('/signup')
    @UsePipes(ValidationPipe)
    async signup(@Body() signupDto: SignupDto): Promise<void>{
        return this._authServices.signup(signupDto);
    }

    @Post('/signin')
    @UsePipes(ValidationPipe)
    async signin(@Body() signinDto: SigninDto){
        return this._authServices.signin(signinDto);
    }

    @Put('/change-password/:id')
    @UsePipes(ValidationPipe)
    async changePassword(@Param('id',ParseIntPipe) id: number,@Body() signupDto: SignupDto): Promise<any>{
        return this._authServices.changePassword(id,signupDto);
    }
}
