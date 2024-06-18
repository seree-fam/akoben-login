import React, { useState } from 'react';

const SemaphoreButton: React.FC = () => {

    return (
        <div>
          {!active ? (
            <button onClick={}>Connect Wallet</button>
          ) : (
            <button onClick={}>Sign In with Semaphore</button>
          )}
          {isAuthenticated && <p>Welcome to the site!</p>}
        </div>
      );
}

export default SemaphoreButton;