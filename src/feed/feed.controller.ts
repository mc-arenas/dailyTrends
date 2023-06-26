import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  HttpCode,
  Put,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { roles } from '../common/types';
import { NoAuthGuard } from '../auth/guards/no-auth.guard';
import { ClientAuthGuard } from '../auth/guards/client-auth.guard';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @UseGuards(ClientAuthGuard, RolesGuard)
  @Roles(roles.admin)
  async create(@Body() createFeedDto: CreateFeedDto) {
    // check if there is another feed related to the same new
    const auxNew = await this.feedService.findOneByOriginalUrl(
      createFeedDto.originalUrl,
    );
    if (auxNew !== null) {
      throw new HttpException(
        `Bad Request, the new id ${createFeedDto.originalUrl} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.feedService.create(createFeedDto);
  }

  @Get()
  findAll() {
    return this.feedService.findAll();
  }

  @Get(':id')
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
