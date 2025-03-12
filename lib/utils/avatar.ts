import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

export function generateAvatar(name: string, size = 128) {
  const avatar = createAvatar(initials, {
    seed: name,
    size,
    backgroundColor: ['4f46e5', '7c3aed', 'a21caf', 'be123c', 'c2410c'],
  });

  return avatar.toDataUriSync();
}