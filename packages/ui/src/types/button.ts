import type { VariantProps } from 'class-variance-authority';

import type { buttonVariants } from '@workspace/ui/components/shadcn/button.js';

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
