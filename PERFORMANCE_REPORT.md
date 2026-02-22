# Performance Improvement Report

## Optimization: React.memo for MessageBubble

### Description
The `MessageBubble` component in `src/components/inbox/ChatScreen.tsx` has been wrapped in `React.memo`.

### Rationale
In a chat application, the message list is frequently updated (appended to) as new messages arrive or are sent. Without `React.memo`, every time the `messages` state array is updated, the parent `ChatScreen` component re-renders. This causes **all** child `MessageBubble` components to re-render, even if their props (`message` and `isCurrentUser`) have not changed.

By using `React.memo`, React will skip rendering the component if the new props are shallowly equal to the old props. Since:
1.  The `message` object reference is stable for existing messages (we append to the array).
2.  The `isCurrentUser` boolean is stable (derived from stable user ID and message sender ID).

This optimization changes the rendering complexity of appending a message from **O(N)** (where N is the number of existing messages) to **O(1)** (only the new message renders, plus overhead).

### Verification
Due to environment constraints (no browser, no test runner with DOM support), a direct benchmark could not be executed. However, the theoretical performance gain is standard for React list rendering.

The change was verified by:
1.  Static analysis of the code to ensure `React.memo` is correctly applied.
2.  Ensuring that props passed to `MessageBubble` are stable enough to benefit from memoization.
