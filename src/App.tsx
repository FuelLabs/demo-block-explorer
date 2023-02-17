import { useState, useEffect } from 'react';
import { getLatestBlocks, getLatestTransactions } from './api';
import { timeSince, convertTime } from './utils';
import './App.css';

function App() {
  const [latestTxns, setLatestTxns] = useState<[]>([]);
  const [latestBlocks, setLatestBlocks] = useState<[]>([]);

  useEffect(() => {
    async function getData() {
      let txnsResponse = await getLatestTransactions();
      console.log("TXNS:", txnsResponse)
      setLatestTxns(txnsResponse.nodes)

      let blocksResponse = await getLatestBlocks();
      console.log("BLOCKS:", blocksResponse)
      setLatestBlocks(blocksResponse.nodes)
    }
    getData();
  }, [])

  interface ShowTimeProps {
    taiTime: string;
  }

  function ShowTime({ taiTime }: ShowTimeProps) {
    let unixTime = Number(convertTime(taiTime))
    let date = new Date(unixTime * 1000);
    let time = timeSince(date);
    return (
      <div>
        {time} ago
      </div>
    )
  }

  return (
    <div className="App">
      {latestTxns.length > 0 && latestBlocks.length > 0 ?
        <>
          <header>
            <h1>Fuel Block Explorer</h1>
          </header>
          <div className="container">
            <div className="latest-container">
              <h2>Latest Blocks:</h2>
              {latestBlocks?.map((block: any, index) => (
                <div className="block-info" key={index}>
                  <div className="side">
                    <div>
                      ID: {block.id.substring(0, 8)}...{block.id.substring(block.id.length - 8)}
                    </div>
                    <ShowTime taiTime={block.header.time} />
                  </div>
                  <div className="side">
                    <div>
                      Height: {block.header.height}
                    </div>
                    <div>
                      Txns: {block.header.transactionsCount}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="latest-container">
              <h2>Latest Transactions:</h2>
              {latestTxns?.map((tx: any, index) => (
                <div className="block-info" key={index}>
                  <div className="side">
                    <div>
                      ID: {tx.id.substring(0, 8)}...{tx.id.substring(tx.id.length - 8)}
                    </div>
                    {tx.inputContracts && tx.inputContracts[0] &&
                      <div>
                        Contract: {tx.inputContracts[0].id.substring(0, 8)}...{tx.inputContracts[0].id.substring(tx.inputContracts[0].id.length - 8)}
                      </div>
                    }
                    {tx.inputAssetIds && tx.inputAssetIds[0] &&
                      <div>
                        Asset ID: {tx.inputAssetIds[0].substring(0, 8)}...{tx.inputAssetIds[0].substring(tx.inputAssetIds[0].length - 8)}
                      </div>
                    }
                  </div>
                  <div className="side">
                    <div>
                      {tx.isCreate && "Create"}
                      {tx.isMint && "Mint"}
                      {tx.isScript && "Script"}
                    </div>
                    <div>
                      {tx.status.time && <ShowTime taiTime={tx.status.time} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
        :
        <div>Loading...</div>
      }
    </div>
  );
}

export default App;
