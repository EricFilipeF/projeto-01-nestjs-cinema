import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FilmeModule } from './filme/filme.module';
import { SalaModule } from './sala/sala.module';
import { SessaoModule } from './sessao/sessao.module';
import { ComboModule } from './combo/combo.module';
import { PedidoModule } from './pedido/pedido.module';
import { IngressoModule } from './ingresso/ingresso.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(__dirname, '..', '.env')],
    }),
    PrismaModule,
    AuthModule,
    FilmeModule,
    SalaModule,
    SessaoModule,
    ComboModule,
    PedidoModule,
    IngressoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
