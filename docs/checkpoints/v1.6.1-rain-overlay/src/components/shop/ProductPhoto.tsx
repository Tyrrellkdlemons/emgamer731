/**
 * ProductPhoto — renders either a normal product image OR a single cell of a
 * composite grid image (split via background-position) so one PNG can serve
 * many real product listings without separate file splits.
 *
 * Crop math (for a cols × rows grid):
 *   background-size:   `${cols*100}% ${rows*100}%`
 *   background-position: `${col/(cols-1)*100}% ${row/(rows-1)*100}%`
 *
 * Edge case: when cols === 1 (single column), the position percentage divides
 * by zero — treat as 0% in that case.
 */

import { cn } from '@/lib/utils';

type Props = {
  hero: string;
  heroCrop?: { src: string; row: number; col: number; rows: number; cols: number };
  alt: string;
  className?: string;
  imgClassName?: string;
};

export function ProductPhoto({ hero, heroCrop, alt, className, imgClassName }: Props) {
  if (heroCrop) {
    const { src, row, col, rows, cols } = heroCrop;
    const sizeX = cols * 100;
    const sizeY = rows * 100;
    const posX = cols > 1 ? (col / (cols - 1)) * 100 : 0;
    const posY = rows > 1 ? (row / (rows - 1)) * 100 : 0;
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn('w-full h-full', className)}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: `${sizeX}% ${sizeY}%`,
          backgroundPosition: `${posX}% ${posY}%`,
          backgroundRepeat: 'no-repeat',
        }}
      />
    );
  }
  // Plain image path or external URL
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={hero}
      alt={alt}
      className={cn('w-full h-full object-cover', imgClassName)}
      loading="lazy"
    />
  );
}
