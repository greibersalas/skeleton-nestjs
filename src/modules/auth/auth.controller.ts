import { Body, Controller, Param, ParseIntPipe, Post, Put, UseGuards, UsePipes, ValidationPipe, Request } from '@nestjs/common';
var moment = require('moment-timezone');
import { JwtAuthGuard } from './strategies/jwt-auth.guard';

import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import { Audit } from '../security/audit/audit.entity';

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

    @UseGuards(JwtAuthGuard)
    @Put('/change-password/:id')
    async changePassword(
        @Param('id',ParseIntPipe) id: number,
        @Body() signupDto: SignupDto,
        @Request() req: any
    ): Promise<any>{
        //Creamos los datos de la auditoria
        const audit = new Audit();
        audit.idregister = id;
        audit.title = 'user';
        audit.description = 'Change password';
        audit.data = JSON.stringify(signupDto);
        audit.iduser = Number(req.user.id);
        audit.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        audit.state = 1;
        //Guardamos la auditoria
        await audit.save();
        return this._authServices.changePassword(id,signupDto);
    }
}
