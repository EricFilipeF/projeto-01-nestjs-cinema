import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComboService } from './combo.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('combo')
export class ComboController {
  constructor(private readonly comboService: ComboService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createComboDto: CreateComboDto) {
    return this.comboService.create(createComboDto);
  }

  @Get()
  findAll() {
    return this.comboService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comboService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComboDto: UpdateComboDto) {
    return this.comboService.update(id, updateComboDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comboService.remove(id);
  }
}
