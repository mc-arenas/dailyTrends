import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpException, HttpCode, Put } from '@nestjs/common';
import { ClientAuthGuard } from 'src/auth/guards/client-auth.guard';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { roles } from 'src/common/types';
import { NoAuthGuard } from 'src/auth/guards/no-auth.guard';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @UseGuards(ClientAuthGuard, RolesGuard)
  @Roles(roles.client)
  async create(@Body() createFeedDto: CreateFeedDto) {
    // check if there is another feed related to the same new
    const auxNew = await this.feedService.findOneByNewId(createFeedDto.newId);
    if (auxNew !== null) {
      throw new HttpException(
        `Bad Request, the new id ${createFeedDto.newId} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.feedService.create(createFeedDto);
  }

  @Get()
  @UseGuards(NoAuthGuard)
  findAll() {
    return this.feedService.findAll();
  }

  @Get(':id')
  @UseGuards(NoAuthGuard)
  async findOne(@Param('id') feedId: string) {
    return await this.feedService.findOne(feedId);
  }

  @Put(':id')
  @UseGuards(ClientAuthGuard, RolesGuard)
  @Roles(roles.admin)
  update(@Param('id') feedId: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.feedService.update(feedId, updateFeedDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(roles.admin)
  remove(@Param('id') feedId: string) {
    return this.feedService.remove(feedId);
  }
}
