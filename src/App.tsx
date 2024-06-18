import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import SemaphoreButton from './SemaphoreButton';

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider);
}

const App: React.FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <header className="App-header">
          <SemaphoreButton />
        </header>
      </div>
    </Web3ReactProvider>
  );
};

export default App;
