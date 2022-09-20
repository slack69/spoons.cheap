import { Container, Typography, styled } from '@material-ui/core';
import { useEffect, useState } from 'react';

import SearchResults from './SearchResults';

import React from 'react';
import { FixMeLater } from './FixMeLater';
import { Search } from './Search';
import { getOpenPubs, getTodaysDrinks } from './lib/wetherspoons';
import { Pub } from './types/Pub';
import { DrinksOnDate } from './types/Drink';
import { getHistoricalDrinks, getRankings } from './lib/internal';
import { Ranking } from './types/Ranking';

const Root = styled(Container)({
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
});

const SearchContainer = styled(Container)({
  display: 'grid',
  placeItems: 'center',
  gridGap: '14px',
});

function App() {
  const [pubs, setPubs] = useState<Pub[]>([]);
  const [rankings, setRankings] = useState<Ranking[]>([]);

  const [pub, setPub] = useState<Pub | undefined>(undefined);

  const [drinks, setDrinks] = useState<DrinksOnDate[]>([]);

  useEffect(() => {
    setDrinks([]);

    if (!pub) return;
    (async function () {
      const todaysDrinks = await getTodaysDrinks(pub.venueId);
      const todaysDate = Date.now();

      setDrinks((drinks) => {
        drinks.push({
          date: todaysDate,
          drinks: todaysDrinks,
        });
        return [...drinks];
      });
    })();

    (async () => {
      const historical = await getHistoricalDrinks(pub.venueId);

      setDrinks((drinks) => {
        drinks.push(...historical);
        return [...drinks];
      });
    })();
  }, [pub]);

  useEffect(() => {
    (async () => {
      const pubs = await getOpenPubs();
      setPubs(pubs);
    })();

    (async () => {
      const rankings = await getRankings();
      setRankings(rankings);
    })();
  }, []);

  return (
    <Root>
      <SearchContainer>
        <Typography
          style={{
            fontFamily: 'Pacifico',
            color: '#dcdcdc',
            filter: 'drop-shadow(5px 5px 8px rgba(0, 0, 0, 0.8))',
            fontSize: '10vw',
          }}
        >
          Spoons.cheap
        </Typography>
        <Search
          options={pubs}
          onChange={(_event: FixMeLater, value: FixMeLater) => {
            setPub(value);
          }}
        />
        <SearchResults drinks={drinks} pub={pub} rankings={rankings} />
      </SearchContainer>
    </Root>
  );
}

export default App;
