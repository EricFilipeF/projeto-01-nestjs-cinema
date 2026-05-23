import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { IngressoService } from './ingresso.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ingresso')
export class IngressoController {
  constructor(private readonly ingressoService: IngressoService) { }

  // @Post()
  // create(@Body() createIngressoDto: CreateIngressoDto) {
  //   return this.ingressoService.create(createIngressoDto);
  // }

  @Get()
  findAll() {
    return this.ingressoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingressoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIngressoDto: UpdateIngressoDto) {
    return this.ingressoService.update(id, updateIngressoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ingressoService.remove(id);
  }
}
