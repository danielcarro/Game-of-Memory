import { GridItemType } from '../../types/GridItemType';
import * as C from './styles';
import dcSvg from '../../svgs/dc.svg';
import { items } from '../../data/items';
type Props = {
    item: GridItemType,
    onClick: () => void
}

export const GridItem = ({ item, onClick }: Props) => {
    //console.log(item.permanentShown);
    return (
        <C.Container
            showBackground={item.permanentShown || item.shown}
            onClick={onClick}
        >
            {item.permanentShown === false && item.shown === false &&
                <C.Icon src={dcSvg} alt='' opacity={.1} />
            }
            {item.shown && item.item !== null &&

                <C.Icon src={items[item.item].icon} alt="" />
            }

            {item.permanentShown && item.item !== null &&
                <C.Icon src={items[item.item].icon} alt="" />
            }


        </C.Container>

    );

}