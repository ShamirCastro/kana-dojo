import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import useTilesMode from '@/shared/hooks/game/useTilesMode';
import useClassicSessionStore from '@/shared/store/useClassicSessionStore';

describe('useTilesMode', () => {
  beforeEach(() => {
    useClassicSessionStore.setState({ activeSessionId: null });
  });

  it('starts adaptive tiles progression at the minimum word length', () => {
    const { result } = renderHook(() =>
      useTilesMode({
        enableAdaptiveWordLength: true,
        minWordLength: 1,
        maxWordLength: 3,
      }),
    );

    expect(result.current.wordLength).toBe(1);
  });

  it('resets adaptive word length when a new classic session starts', async () => {
    const { result } = renderHook(() =>
      useTilesMode({
        enableAdaptiveWordLength: true,
        minWordLength: 1,
        maxWordLength: 3,
      }),
    );

    act(() => {
      result.current.setWordLength(3);
    });

    expect(result.current.wordLength).toBe(3);

    act(() => {
      useClassicSessionStore.setState({ activeSessionId: 'session-2' });
    });

    await waitFor(() => {
      expect(result.current.wordLength).toBe(1);
    });
  });
});
