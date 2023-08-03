"use client"

import { useEffect, useState } from "react";

import * as C from "./App.styles";
import logoImage from "../assets/devmemory_logo.png";
import RestartIcon from "../svgs/restart.svg"

import { InfoItem } from "@/components/InfoItem";
import { Button } from "@/components/Button";

import { items } from "../data/item"

import { GridItemType } from "@/types/GridItemType";
import { GridItem } from "@/components/GridItem";
import { formatTimeElapsed } from "@/helpers/formattimeElapsed";

const Page = () => {
    
    const [playing, setPlaying] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const [moveCount, setMoveCount ] = useState<number>(0);
    const [shownCount,setShownCount ] = useState<number>(0);
    const [gridItems, setGridItems] = useState<GridItemType[]>([]);

    useEffect(() => resetAndCreateGrid(), [])

    useEffect(() => {
        const timer =  setInterval(() => {
            if(playing) setTimeElapsed(timeElapsed + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [playing, timeElapsed])
    
    // verificar se as caratas que abriram 

    useEffect(() => {
        if (shownCount === 2) {
            
            let opened:GridItemType[] = gridItems.filter(item => item.shown === true);
            if (opened.length === 2) {

                if (opened[0].item === opened[1].item) {
                    let tmpGrid = [...gridItems];
                    for(let i in tmpGrid){
                        if(tmpGrid[i].shown){
                            tmpGrid[i].permanentShown = true;
                            tmpGrid[i].shown = false;
                        };
                    };
                    setGridItems(tmpGrid);
                    setShownCount(0);
                } else {
                    setTimeout(() => {
                        let tmpGrid = [...gridItems];
                        for (let i in tmpGrid) {
                            tmpGrid[i].shown = false;
                        }
                        setGridItems(tmpGrid);
                        setShownCount(0);
                    }, 1000);
                };


                setMoveCount(moveCount => moveCount + 1);
            }
        }
    }, [shownCount, gridItems]);

    useEffect(() => {
        if (moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
            setPlaying(false);
        }
    }, [moveCount, gridItems]);

    const resetAndCreateGrid = () => {
    // Passo 1
        setTimeElapsed(0);
        setMoveCount(0);
        setShownCount(0)
    // Passo 2.1 fazer o array do grid
        let tmpGrid: GridItemType[] = [];
        for (let i = 0; i < (items.length * 2); i++) 
            {tmpGrid.push({item: null, permanentShown: false, shown: false,});
        };
    // passo 2.2 preencher o grid
        for (let w = 0; w < 2; w++) {
            for (let i = 0; i < items.length; i++) {
                let pos = -1;
                while (pos < 0 || tmpGrid[pos].item !== null) {
                    pos = Math.floor(Math.random() * (items.length * 2));
                };
                tmpGrid[pos].item = i;
            };   
        };
    // Passo 2.3 jogar dentro do grid
        setGridItems(tmpGrid)
    // Passo 3
        setPlaying(true);
        
    }

    const handlerIremClick = (index: number) => {
        if(playing && index !== null && shownCount < 2){
            let tmpGrid = [...gridItems];
            if (tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
                tmpGrid[index].shown = true;
                setShownCount(shownCount + 1);
            };
            setGridItems(tmpGrid);
        };
    };

    return (
        <div>
            <C.Container>
                <C.Info>
                    <C.LogLink>
                        <img src={logoImage.src} width={200} alt="" />
                    </C.LogLink>

                    <C.InfoArea>
                        <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)}/> 
                        <InfoItem label="Movimentos" value={moveCount.toString()}/>
                    </C.InfoArea>
                    <Button label="Reiniciar" icon={RestartIcon.src} onClick={resetAndCreateGrid}/>
                </C.Info>
                <C.GridArea>
                    <C.Grid>
                        {gridItems.map((item, index) => (
                            <GridItem
                                key={index}
                                item={item}
                                onClick={() => handlerIremClick(index)}
                            />
                        ))}
                    </C.Grid>
                </C.GridArea>
            </C.Container>
        </div>
    )
}

export default Page;