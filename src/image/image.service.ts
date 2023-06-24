import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { env } from 'process';
import { uuid } from 'uuidv4';

@Injectable()
export class ImageService {
  private containerName: string;

  private async getBlobServiceInstance() {
    const blobClientService = await BlobServiceClient.fromConnectionString(
      env.AZURE_CONNECTION_STRING,
    );
    return blobClientService;
  }

  private async getBlobClient(imageName: string): Promise<BlockBlobClient> {
    const blobService = await this.getBlobServiceInstance();
    const containerClient = blobService.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(imageName);

    return blockBlobClient;
  }

  public async uploadFile(file: Express.Multer.File) {
    this.containerName = env.AZURE_CONTAINER_NAME;
    const extension = file.originalname.split('.').pop();
    const file_name = uuid() + '.' + extension;
    const blockBlobClient = await this.getBlobClient(file_name);
    const fileUrl = blockBlobClient.url;
    await blockBlobClient.uploadData(file.buffer);

    return fileUrl;
  }
}
