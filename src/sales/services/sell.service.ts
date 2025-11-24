import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { DataSource, Repository } from 'typeorm';
import { ManualSellDTO } from '../dtos/manual-sell.dto';

@Injectable()
export class SellService {
  constructor(
    private dataSource: DataSource,
  ) {}

  async manualSell(payload: ManualSellDTO[]) {
    return this.dataSource.transaction(async (manager) => {
      for (const inlineProduct of payload) {
        const variant = await manager.findOne(ProductVariant, {
          where: { sku: inlineProduct.productVariantSku },
          lock: { mode: 'pessimistic_write' },
        });

        if (!variant) {
          throw new NotFoundException('Variant not found');
        }

        if (variant.stock < inlineProduct.quantity) {
          throw new BadRequestException(
            `Insufficient stock. Available: ${variant.stock}`,
          );
        }

        await manager.update(ProductVariant, variant.id, {
          totalSales: () => '"total_sales" + ' + inlineProduct.quantity,
          stock: () => '"stock" - ' + inlineProduct.quantity,
        });

        const updated = await manager.findOne(ProductVariant, {
          where: { id: variant.id },
        });

        if (!updated) {
          throw new NotFoundException('Variant not found');
        }

        if (updated.stock === 0 && updated.isAvailable) {
          await manager.update(ProductVariant, variant.id, {
            isAvailable: false,
          });
        }

        return 'Sell registered on DB.';
      }
    });
  }
}
