import { BadRequestException, Controller, Delete, Post, Req } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { IdParam } from '~/common/decorators/id-param.decorator'
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator'
import { AuthUser } from '~/modules/auth/decorators/auth-user.decorator'
import { definePermission, Perm } from '~/modules/auth/decorators/permission.decorator'
import { Resource } from '~/modules/auth/decorators/resource.decorator'
import { Storage } from '~/modules/tools/storage/storage.entity'
import { FileUploadDto } from './upload.dto'
import { UploadService } from './upload.service'

export const permissions = definePermission('upload', {
  UPLOAD: 'upload',
} as const)

@ApiSecurityAuth()
@ApiTags('Tools - 上传模块')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @Perm(permissions.UPLOAD)
  @ApiOperation({ summary: '上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async upload(@Req() req: FastifyRequest, @AuthUser() user: IAuthUser) {
    if (!req.isMultipart())
      throw new BadRequestException('Request is not multipart')

    const file = await req.file()

    // https://github.com/fastify/fastify-multipart
    // const parts = req.files()
    // for await (const part of parts)
    //   console.log(part.file)

    try {
      const { path } = await this.uploadService.saveFile(file, user.uid)

      return {
        filename: path,
      }
    }
    catch (error) {
      console.log(error)
      throw new BadRequestException('上传失败')
    }
  }

  @Post('mobile')
  @Perm(permissions.UPLOAD)
  @ApiOperation({ summary: '移动端上传' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async uploadMobile(@Req() req: FastifyRequest, @AuthUser() user: IAuthUser) {
    if (!req.isMultipart())
      throw new BadRequestException('Request is not multipart')

    const file = await req.file()

    // https://github.com/fastify/fastify-multipart
    // const parts = req.files()
    // for await (const part of parts)
    //   console.log(part.file)

    try {
      return await this.uploadService.saveFile(file, user.uid)
    }
    catch (error) {
      console.log(error)
      throw new BadRequestException('上传失败')
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除Upload' })
  @Perm(permissions.UPLOAD)
  @Resource(Storage)
  async delete(@IdParam() id: number): Promise<void> {
    await this.uploadService.delete(id)
  }
}
