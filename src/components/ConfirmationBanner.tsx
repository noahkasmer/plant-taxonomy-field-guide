import type { IdentificationResult } from '@/types/dichotomousKey';

type Props = {
  result: IdentificationResult;
};

// Placeholder for future AI confirmation (online: Claude API, offline: on-device vision model).
// Accepts the key result and renders nothing until the confirmation layer is implemented.
export function ConfirmationBanner(_props: Props) {
  return null;
}
