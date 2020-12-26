import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: '3D Characters',
    icon: 'home-outline',
    link: '/pages/characters/character-filter',
    home: true
  },
  {
    title: 'Items',
    icon: 'list',
    link: '/pages/items/item-filter',
    home: true
  },
  {
    title: 'Items Allocation',
    icon: 'checkmark-square-2-outline',
    link: '/pages/allocation/allocation-scene',
    pathMatch: 'prefix'
  }


];
