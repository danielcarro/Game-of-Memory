import { useEffect, useState } from 'react';
import * as C from './App.styles';
import logoimage from './assets/devmemory_logo.png';
import { Button } from './components/Button';
import { InfoItem } from './components/InfoItem';
import RestarIcon from './svgs/restart.svg';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatTimeElapesed';

const App = () => {

  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElepsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShowCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

  useEffect(() => resetAndCreateGrid(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) {
        setTimeElepsed(timeElapsed + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);



  useEffect(() => {
    if (shownCount === 2) {
      let opened = gridItems.filter(item => item.shown === true);
      if (opened.length === 2) {

        if (opened[0].item === opened[1].item) {
          //v1 - if both are equal, make every "show" permanent
          let tmpGrid = [...gridItems];
          for (let i in tmpGrid) {
            if (tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true;
              tmpGrid[i].shown = false;
            }
          }
          setGridItems(tmpGrid);
          setShowCount(0);
        } else {
          // v2 - if they are NOT equal, close all "shown";
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShowCount(0);
          }, 1000);

        }
        setMoveCount(moveCount + 1);
      }
    }
  }, [shownCount, gridItems]);

  //verify if game is over 
  useEffect(() => {
    if (moveCount > 0 && gridItems.every(item => item.permanentShown === true))
      setPlaying(false);
  }, [moveCount, gridItems]);


  const resetAndCreateGrid = () => {
    // passo 1- resetar o jogo
    setTimeElepsed(0);
    setMoveCount(0);
    setShowCount(0);
    // passo 2 -- criar o grid e começar o jogo
    // 2.1 -- criar grid vazio
    let tmpGrid: GridItemType[] = []
    for (let i = 0; i < (items.length * 2); i++) tmpGrid.push({
      item: null, shown: false, permanentShown: false
    });
    //2.2 -- preencher o grid
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < items.length; i++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2));
        }
        tmpGrid[pos].item = i;
      }
    }
    //2.3 -- jogar no state
    setGridItems(tmpGrid);
    // passo 3 -- começar o jogo
    setPlaying(true);
  }

  const handleItemClick = (index: number) => {
    if (playing && index !== null && shownCount < 2) {
      let tmpGrid = [...gridItems];
      if (tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true
        setShowCount(shownCount + 1);
      }
      setGridItems(tmpGrid);
    }
  }


  return (
    <C.Container>
      <C.Info>
        <C.LogoLink>
          <img src={logoimage} width="200" alt="" />
        </C.LogoLink>
        <C.InfoArea>

          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label='Movimetos' value={moveCount.toString()} />
        </C.InfoArea>
        <Button label='Reiniciar' icon={RestarIcon} onClick={resetAndCreateGrid} />
      </C.Info>

      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>


      </C.GridArea>

    </C.Container>
  );
}
export default App;