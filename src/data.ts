export interface MenuItem {
  id: string;
  category: string;
  name: string; // english
  nativeName: string; // hindi
  priceHalf?: string;
  priceFull?: string;
  portion?: string;
  offer?: string;
  imageName?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export const menuData: MenuItem[] = [];
